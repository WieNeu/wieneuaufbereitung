(function () {
  const grid = document.getElementById('instagramReelsGrid');
  const status = document.getElementById('instagramReelsStatus');
  if (!grid || !status) return;

  const profileUrl = 'https://www.instagram.com/autoaufbereitung_wie_neu/';

  function safeInstagramPermalink(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:'
        && (url.hostname === 'instagram.com' || url.hostname === 'www.instagram.com')
        ? url.href
        : null;
    } catch {
      return null;
    }
  }

  function safeImageUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : null;
    } catch {
      return null;
    }
  }

  function createReelCard(reel) {
    const permalink = safeInstagramPermalink(reel.permalink);
    if (!permalink || !reel.id) return null;

    const article = document.createElement('article');
    article.className = 'instagram-reel-card';

    const link = document.createElement('a');
    link.className = 'instagram-reel-link';
    link.href = permalink;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Reel auf Instagram ansehen');

    const media = document.createElement('div');
    media.className = 'instagram-reel-media';
    const imageUrl = safeImageUrl(reel.imageUrl);

    if (imageUrl) {
      const image = document.createElement('img');
      image.src = imageUrl;
      image.alt = '';
      image.width = 360;
      image.height = 640;
      image.loading = 'lazy';
      image.decoding = 'async';
      media.appendChild(image);
    } else {
      const placeholder = document.createElement('span');
      placeholder.className = 'instagram-reel-placeholder';
      placeholder.textContent = 'Instagram Reel';
      media.appendChild(placeholder);
    }

    const watchLabel = document.createElement('span');
    watchLabel.className = 'instagram-reel-watch';
    watchLabel.textContent = 'Auf Instagram ansehen';
    media.appendChild(watchLabel);
    link.appendChild(media);

    const meta = document.createElement('div');
    meta.className = 'instagram-reel-meta';
    const date = document.createElement('time');
    const timestamp = Date.parse(reel.timestamp || '');
    if (Number.isFinite(timestamp)) {
      date.dateTime = new Date(timestamp).toISOString();
      date.textContent = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(timestamp);
    } else {
      date.textContent = 'Instagram Reel';
    }
    const platform = document.createElement('span');
    platform.textContent = 'Instagram';
    meta.append(date, platform);

    article.append(link, meta);
    return article;
  }

  async function loadReels() {
    try {
      const response = await fetch('data/instagram-reels.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Reels konnten nicht geladen werden.');

      const snapshot = await response.json();
      const uniqueReels = new Map();
      (Array.isArray(snapshot.reels) ? snapshot.reels : []).forEach(function (reel) {
        if (reel && reel.id && !uniqueReels.has(reel.id)) uniqueReels.set(reel.id, reel);
      });

      const cards = [...uniqueReels.values()].slice(0, 9).map(createReelCard).filter(Boolean);
      grid.replaceChildren(...cards);

      if (cards.length) {
        status.textContent = snapshot.updatedAt
          ? 'Zuletzt aktualisiert: ' + new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(snapshot.updatedAt))
          : 'Aktuelle Instagram Reels';
      } else {
        status.textContent = 'Neue Reels erscheinen hier automatisch, sobald die Instagram-Verbindung eingerichtet ist.';
      }
    } catch {
      grid.replaceChildren();
      status.textContent = 'Die Reels sind gerade nicht verfügbar. Alle Videos findest du direkt auf Instagram.';
    }
  }

  loadReels();
})();