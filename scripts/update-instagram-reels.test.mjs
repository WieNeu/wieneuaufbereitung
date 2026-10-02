import assert from 'node:assert/strict';
import test from 'node:test';
import { selectLatestReels } from './update-instagram-reels.mjs';

test('selects newest Reels only and deduplicates media IDs', () => {
  const media = [
    { id: 'reel-old', media_type: 'VIDEO', media_product_type: 'REELS', permalink: 'https://www.instagram.com/reel/old/', timestamp: '2026-01-01T10:00:00+0000' },
    { id: 'feed-video', media_type: 'VIDEO', media_product_type: 'FEED', permalink: 'https://www.instagram.com/p/feed/', timestamp: '2026-03-01T10:00:00+0000' },
    { id: 'reel-new', media_type: 'VIDEO', media_product_type: 'REELS', permalink: 'https://www.instagram.com/reel/new/', timestamp: '2026-05-01T10:00:00+0000', thumbnail_url: 'https://cdn.example/new.jpg' },
    { id: 'reel-new', media_type: 'VIDEO', media_product_type: 'REELS', permalink: 'https://www.instagram.com/reel/new/', timestamp: '2026-05-01T10:00:00+0000' },
    { id: 'photo', media_type: 'IMAGE', media_product_type: 'FEED', permalink: 'https://www.instagram.com/p/photo/', timestamp: '2026-06-01T10:00:00+0000' }
  ];

  assert.deepEqual(selectLatestReels(media), [
    {
      id: 'reel-new',
      permalink: 'https://www.instagram.com/reel/new/',
      timestamp: '2026-05-01T10:00:00+0000',
      imageUrl: 'https://cdn.example/new.jpg'
    },
    {
      id: 'reel-old',
      permalink: 'https://www.instagram.com/reel/old/',
      timestamp: '2026-01-01T10:00:00+0000',
      imageUrl: null
    }
  ]);
});

test('limits the result to the requested number', () => {
  const media = Array.from({ length: 5 }, (_, index) => ({
    id: `reel-${index}`,
    media_type: 'VIDEO',
    media_product_type: 'REELS',
    permalink: `https://www.instagram.com/reel/${index}/`,
    timestamp: `2026-05-0${index + 1}T10:00:00+0000`
  }));

  assert.equal(selectLatestReels(media, 3).length, 3);
});