import React from 'react';

// Elegant default wedding card cover fallback in case Google Drive thumbnail fails to load
export const DEFAULT_FALLBACK_COVER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAHN6q_GJKk9sMGQJ8K4E3wa4d5uv7hF5xgmgHLszooEahvwNzkaIxn41Zp8xTnWwjgm5LhYZzkSzY_8q24zHjJTGp2R2MBD7-9rIe4slDQ7zadSTu6dk1X6AvHMmYplLyKzE3Kqt3V5jX1Rv0rlfj1gOPbAtulqvQ3woci3u6rVxVgnSYHXttipegQGlcmQlFEEF3nrd8KslSK7DH04lEbjkS69On-uPZLE-i0T6w';

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  if (target.src !== DEFAULT_FALLBACK_COVER) {
    target.src = DEFAULT_FALLBACK_COVER;
  }
}
