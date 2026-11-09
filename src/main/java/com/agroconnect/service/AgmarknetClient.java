package com.agroconnect.service;

import com.agroconnect.api.dto.ApiDtos.MandiRateResponse;
import com.agroconnect.domain.CropType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.math.BigDecimal;
import java.net.http.HttpClient;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDate;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

/** Reads Maharashtra market reports from the Government of India's AGMARKNET OGD feed. */
@Component
@Slf4j
public class AgmarknetClient {
    private static final String RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private volatile FeedSnapshot feedSnapshot;
    private volatile Instant retryAfter = Instant.EPOCH;

    private record FeedSnapshot(JsonNode payload, Instant fetchedAt) {}

    public AgmarknetClient(RestClient.Builder builder, ObjectMapper objectMapper,
                           @Value("${agroconnect.market.data-gov-in.api-key:}") String apiKey) {
        var httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3)).build();
        var requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofSeconds(7));
        this.restClient = builder.requestFactory(requestFactory).baseUrl("https://api.data.gov.in").build();
        this.objectMapper = objectMapper;
        this.apiKey = apiKey == null ? "" : apiKey.trim();
    }

    public List<MandiRateResponse> searchMaharashtra(String locality) {
        if (apiKey.isBlank()) return List.of();
        JsonNode payload = loadFeed();
        return payload == null ? List.of() : mapRecords(payload, locality == null ? "" : locality);
    }

    private JsonNode loadFeed() {
        FeedSnapshot current = feedSnapshot;
        Instant now = Instant.now();
        if (current != null && current.fetchedAt().plus(Duration.ofMinutes(10)).isAfter(now)) return current.payload();
        if (retryAfter.isAfter(now)) return current == null ? null : current.payload();
        synchronized (this) {
            current = feedSnapshot;
            now = Instant.now();
            if (current != null && current.fetchedAt().plus(Duration.ofMinutes(10)).isAfter(now)) return current.payload();
            if (retryAfter.isAfter(now)) return current == null ? null : current.payload();
        try {
            String payload = restClient.get()
                    .uri(uri -> uri.path("/resource/" + RESOURCE_ID)
                            .queryParam("api-key", apiKey)
                            .queryParam("format", "json")
                            // The OGD resource supports up to 10,000 records per request.
                            // Fetch the statewide slice so blank locality searches cover every
                            // Maharashtra district represented in the latest published feed.
                            .queryParam("limit", "10000")
                            .queryParam("filters[state]", "Maharashtra")
                            .build())
                    .retrieve().body(String.class);
            if (payload == null || payload.isBlank()) throw new IllegalStateException("Empty AGMARKNET response");
            JsonNode parsed = objectMapper.readTree(payload);
            if (!parsed.path("records").isArray()) throw new IllegalStateException("AGMARKNET response has no records");
            feedSnapshot = new FeedSnapshot(parsed, Instant.now());
            retryAfter = Instant.EPOCH;
            return parsed;
        } catch (RestClientException | java.io.IOException ex) {
            log.warn("AGMARKNET market feed unavailable; using saved market reports.");
            retryAfter = Instant.now().plus(Duration.ofMinutes(1));
            return feedSnapshot == null ? null : feedSnapshot.payload();
        } catch (IllegalStateException ex) {
            log.warn("AGMARKNET market feed returned an invalid response; using saved market reports.");
            retryAfter = Instant.now().plus(Duration.ofMinutes(1));
            return feedSnapshot == null ? null : feedSnapshot.payload();
        }
        }
    }

    List<MandiRateResponse> mapRecords(JsonNode payload, String locality) {
        JsonNode records = payload.path("records");
        if (!records.isArray()) return List.of();
        String query = normalize(locality);
        Map<String, MandiRateResponse> deduplicated = new LinkedHashMap<>();
        for (JsonNode record : records) {
            String state = text(record, "state");
            String district = text(record, "district");
            String market = text(record, "market");
            if (!state.equalsIgnoreCase("Maharashtra") ||
                    (!query.isBlank() && !normalize(district).contains(query) && !normalize(market).contains(query))) continue;
            CropType crop = mapCrop(text(record, "commodity"));
            LocalDate date = parseDate(text(record, "arrival_date"));
            BigDecimal min = decimal(record, "min_price");
            BigDecimal max = decimal(record, "max_price");
            BigDecimal modal = decimal(record, "modal_price");
            if (crop == null || date == null || min == null || max == null || modal == null ||
                    min.signum() < 0 || min.compareTo(modal) > 0 || modal.compareTo(max) > 0) continue;
            String variety = text(record, "variety");
            String grade = text(record, "grade");
            String identity = String.join("|", crop.name(), normalize(market), normalize(district),
                    normalize(variety), normalize(grade), date.toString());
            UUID id = UUID.nameUUIDFromBytes(identity.getBytes(StandardCharsets.UTF_8));
            deduplicated.putIfAbsent(identity, new MandiRateResponse(id, crop, market, modal, min, max,
                    BigDecimal.ZERO, district, null, district, true, "OFFICIAL_FEED", date));
        }
        return new ArrayList<>(deduplicated.values());
    }

    private static CropType mapCrop(String commodity) {
        String value = normalize(commodity);
        if (value.contains("soy") || value.contains("soya")) return CropType.SOYBEAN;
        if (value.contains("tur") || value.contains("arhar") || value.contains("toor")) return CropType.TOOR;
        if (value.contains("wheat")) return CropType.WHEAT;
        if (value.contains("cotton")) return CropType.COTTON;
        if (value.contains("gram") || value.contains("chana") || value.contains("chickpea")) return CropType.GRAM;
        if (value.contains("maize") || value.contains("corn")) return CropType.MAIZE;
        if (value.contains("onion")) return CropType.ONION;
        if (value.contains("jowar") || value.contains("sorghum")) return CropType.JOWAR;
        return null;
    }

    private static LocalDate parseDate(String value) {
        if (value.isBlank()) return null;
        try { return LocalDate.parse(value); }
        catch (DateTimeParseException ignored) {
            try { return LocalDate.parse(value, DateTimeFormatter.ofPattern("dd/MM/uuuu", Locale.ROOT)); }
            catch (DateTimeParseException alsoIgnored) { return null; }
        }
    }

    private static BigDecimal decimal(JsonNode record, String field) {
        String value = text(record, field).replace(",", "").trim();
        try { return value.isBlank() ? null : new BigDecimal(value); }
        catch (NumberFormatException ignored) { return null; }
    }

    private static String text(JsonNode record, String field) {
        JsonNode value = record.get(field);
        return value == null || value.isNull() ? "" : value.asText("").trim();
    }

    private static String normalize(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
    }
}
