(() => {
  const host = document.getElementById('marketTicker');
  if (!host) return;

  const mobileQuery = window.matchMedia('(max-width: 680px)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentTrack = null;
  let movingTrack = null;
  let firstSequence = null;
  let resizeObserver = null;

  const updateLayout = () => {
    if (!currentTrack || !movingTrack || !firstSequence) return;
    const width = firstSequence.getBoundingClientRect().width;
    if (!width) return;
    const staticMode = mobileQuery.matches || reducedMotionQuery.matches;
    host.classList.toggle('market-ticker-static', staticMode);
    const copiesNeeded = staticMode ? 1 : Math.max(2, Math.ceil(currentTrack.clientWidth / width) + 1);
    while (movingTrack.children.length < copiesNeeded) {
      const clone = firstSequence.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('a,button').forEach(control => control.tabIndex = -1);
      movingTrack.append(clone);
    }
    while (movingTrack.children.length > copiesNeeded) movingTrack.lastElementChild.remove();
    movingTrack.style.setProperty('--market-ticker-offset', `${-width}px`);
    host.style.setProperty('--market-ticker-duration', `${width / 28}s`);
  };

  const setContinuousTrack = () => {
    const track = host.querySelector('.market-ticker-track');
    if (!track) return;
    if (track === currentTrack) { updateLayout(); return; }

    resizeObserver?.disconnect();
    const sourceItems = Array.from(track.children);
    if (!sourceItems.length) return;
    firstSequence = document.createElement('div');
    firstSequence.className = 'market-ticker-sequence';
    sourceItems.forEach(item => firstSequence.append(item));
    movingTrack = document.createElement('div');
    movingTrack.className = 'market-ticker-track-inner';
    movingTrack.append(firstSequence);
    track.replaceChildren(movingTrack);
    currentTrack = track;

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(updateLayout);
      resizeObserver.observe(firstSequence);
      resizeObserver.observe(track);
    }
    updateLayout();
  };

  host.addEventListener('click', event => {
    const button = event.target.closest('.market-ticker-pause');
    if (!button) return;
    const paused = button.getAttribute('aria-pressed') !== 'true';
    const marathi = document.documentElement.dataset.locale === 'mr';
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', paused ? (marathi ? 'दरांची हालचाल पुन्हा सुरू करा' : 'Resume market rates') : (marathi ? 'दरांची हालचाल थांबवा' : 'Pause market rates'));
    button.querySelector('[aria-hidden="true"]').textContent = paused ? '▶' : 'Ⅱ';
    button.querySelector('.market-ticker-control-label').textContent = paused ? (marathi ? 'सुरू' : 'Resume') : (marathi ? 'थांबवा' : 'Pause');
    host.classList.toggle('is-paused', paused);
  });

  mobileQuery.addEventListener?.('change', updateLayout);
  reducedMotionQuery.addEventListener?.('change', updateLayout);
  document.addEventListener('visibilitychange', () => host.classList.toggle('is-document-hidden', document.hidden));
  new MutationObserver(setContinuousTrack).observe(host, { childList: true });
  setContinuousTrack();
})();
