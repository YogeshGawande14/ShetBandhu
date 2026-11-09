package com.agroconnect.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;

class AgmarknetClientTest {
    private final ObjectMapper mapper = new ObjectMapper();
    private final AgmarknetClient client = new AgmarknetClient(RestClient.builder(), mapper, "test-key");

    @Test
    void mapsMaharashtraMarketRowsAndFiltersByDistrictOrMarket() throws Exception {
        var payload = mapper.readTree("""
                {"records":[
                  {"state":"Maharashtra","district":"Akola","market":"Akola","commodity":"Soyabean","arrival_date":"07/11/2026","min_price":"4600","max_price":"4900","modal_price":"4750"},
                  {"state":"Maharashtra","district":"Washim","market":"Risod","commodity":"Cotton","arrival_date":"2026-11-07","min_price":"7000","max_price":"7400","modal_price":"7200"},
                  {"state":"Gujarat","district":"Akola","market":"Other","commodity":"Soybean","arrival_date":"2026-11-07","min_price":"1","max_price":"3","modal_price":"2"}
                ]}
                """);

        var rates = client.mapRecords(payload, "akola");

        assertThat(rates).hasSize(1);
        assertThat(rates.getFirst().sourceLabel()).isEqualTo("OFFICIAL_FEED");
        assertThat(rates.getFirst().mandiName()).isEqualTo("Akola");
        assertThat(rates.getFirst().ratePerQuintal()).hasToString("4750");
        assertThat(rates.getFirst().recordDate().toString()).isEqualTo("2026-11-07");
    }

    @Test
    void acceptsEveryMaharashtraMarketWhenNoLocalityIsSpecified() throws Exception {
        var payload = mapper.readTree("""
                {"records":[
                  {"state":"Maharashtra","district":"Akola","market":"Akola","commodity":"Tur","arrival_date":"2026-11-07","min_price":"8000","max_price":"9000","modal_price":"8500"},
                  {"state":"Maharashtra","district":"Pune","market":"Pune","commodity":"Wheat","arrival_date":"2026-11-07","min_price":"2000","max_price":"3000","modal_price":"2500"}
                ]}
                """);

        assertThat(client.mapRecords(payload, "")).hasSize(2);
    }

    @Test
    void doesNotMakeExternalCallsWhenNoGovernmentApiKeyIsConfigured() {
        var unconfigured = new AgmarknetClient(RestClient.builder(), mapper, "");

        assertThat(unconfigured.searchMaharashtra("Akola")).isEmpty();
    }
}
