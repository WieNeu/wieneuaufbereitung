import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const API_VERSION = process.env.META_GRAPH_API_VERSION || 'v25.0';
const REELS_LIMIT = 9;
const PAGE_SIZE = 50;
const MAX_PAGES = 10;
const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/autoaufbereitung_wie_neu/';
const DATA_FILE = fileURLToPath(new URL('../data/instagram-reels.json', import.meta.url));

export function selectLatestReels(media, limit = REELS_LIMIT) {
  const unique = new Map();

  for (const item of media) {
    if (item.media_product_type !== 'REELS' || item.media_type !== 'VIDEO') continue;
    if (!item.id || !item.permalink || unique.has(item.id)) continue;

    unique.set(item.id, {
      id: item.id,
      permalink: item.permalink,
      timestamp: item.timestamp || null,
      imageUrl: item.thumbnail_url || item.media_url || null
    });
  }

  return [...unique.values()]
    .sort((left, right) => Date.parse(right.timestamp || '') - Date.parse(left.timestamp || ''))
    .slice(0, limit);
}

async function fetchMediaPage(url, accessToken) {
  let response;

  try {
    response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  } catch {
    throw new Error('Meta Graph API request failed or timed out.');
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error('Meta Graph API returned an invalid response.');
  }

  if (!response.ok || payload.error) {
    const detail = String(payload.error?.message || response.statusText || 'Unknown API error')
      .replaceAll(accessToken, '[redacted]');
    throw new Error(`Meta Graph API returned HTTP ${response.status}: ${detail}`);
  }

  return payload;
}

async function getLatestReels(userId, accessToken) {
  const firstPage = new URL(`https://graph.facebook.com/${API_VERSION}/${encodeURIComponent(userId)}/media`);
  firstPage.searchParams.set('fields', 'id,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp');
  firstPage.searchParams.set('limit', String(PAGE_SIZE));
  firstPage.searchParams.set('access_token', accessToken);

  const media = [];
  let nextPage = firstPage.toString();

  for (let page = 0; nextPage && page < MAX_PAGES; page += 1) {
    const payload = await fetchMediaPage(nextPage, accessToken);
    media.push(...(Array.isArray(payload.data) ? payload.data : []));

    const reels = selectLatestReels(media);
    if (reels.length >= REELS_LIMIT || !payload.paging?.next) break;

    const nextUrl = new URL(payload.paging.next);
    if (nextUrl.protocol !== 'https:' || nextUrl.hostname !== 'graph.facebook.com') {
      throw new Error('Meta Graph API returned an unexpected pagination URL.');
    }
    nextPage = nextUrl.toString();
  }

  return selectLatestReels(media);
}

async function syncInstagramReels() {
  const accessToken = process.env.META_USER_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !userId) {
    console.warn('Instagram sync skipped: configure META_USER_ACCESS_TOKEN and INSTAGRAM_USER_ID.');
    return;
  }

  const reels = await getLatestReels(userId, accessToken);
  const result = {
    updatedAt: new Date().toISOString(),
    profileUrl: INSTAGRAM_PROFILE_URL,
    reels
  };
  const temporaryFile = `${DATA_FILE}.tmp`;

  await mkdir(dirname(DATA_FILE), { recursive: true });
  await writeFile(temporaryFile, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  await rename(temporaryFile, DATA_FILE);
  console.info(`Instagram sync complete: ${reels.length} unique Reels.`);
}

const isDirectRun = process.argv[1]
  && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectRun) {
  syncInstagramReels().catch((error) => {
    console.warn(`Instagram sync failed; keeping the last published snapshot. ${error.message}`);
  });
}