import {
  InvitationItem,
  AppsScriptResponse,
  RawAppsScriptItem,
  SegmentTier,
  OrientationType,
} from '../types/invitation';
import { DEFAULT_FALLBACK_COVER } from '../utils/imageFallback';

export const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzInTSFhwdXKIqG_wbBXFvqY8BIb5JWW148FE4B8528r1Hi8hLfx3oqFL541XUsg4x_Qw/exec';

const CACHE_KEY = 'rezwan_catalog_apps_script_cache';

const COLOR_HEX_MAP: Record<string, string> = {
  cokelat: '#78350F',
  biru: '#2563EB',
  pink: '#EC4899',
  hitam: '#1E293B',
  krem: '#D97706',
  hijau: '#16A34A',
  'kuning / emas': '#D4AF37',
  kuning: '#EAB308',
  emas: '#D4AF37',
  putih: '#FFFFFF',
  ungu: '#9333EA',
  'abu-abu': '#64748B',
  merah: '#DC2626',
  sage: '#8A9A86',
  navy: '#0F172A',
  maroon: '#800020',
  terracotta: '#E07A5F',
  lilac: '#C084FC',
};

export function getColorHex(colorName: string): string {
  if (!colorName) return '#CBD5E1';
  const clean = colorName.toLowerCase().trim();
  for (const [key, hex] of Object.entries(COLOR_HEX_MAP)) {
    if (clean.includes(key)) return hex;
  }
  return '#94A3B8';
}

export function normalizeOrientation(raw: string): OrientationType {
  const clean = (raw || '').toLowerCase().trim();
  if (clean.includes('land') || clean.includes('lan')) return 'Lanskap';
  if (clean.includes('square') || clean.includes('persegi')) return 'Persegi';
  return 'Portrait';
}

export function normalizeSegment(raw: string): SegmentTier {
  const clean = (raw || '').toLowerCase().trim();
  if (clean.includes('super') || clean.includes('hemat')) return 'SUPER HEMAT';
  if (clean.includes('ekonomis')) return 'EKONOMIS';
  if (clean.includes('menengah')) return 'MENENGAH';
  return 'PREMIUM';
}

export function formatProductCode(series: string, rawCode: string | number): string {
  if (rawCode === null || rawCode === undefined || rawCode === '') {
    return series || 'PROD';
  }

  let codeStr = String(rawCode).trim();
  // If numeric and less than 10, maintain two-digit formatting
  if (/^\d+$/.test(codeStr)) {
    const num = parseInt(codeStr, 10);
    codeStr = num < 10 ? `0${num}` : `${num}`;
  }

  // If code already contains letters or dash (e.g. BABY-08), return it
  if (/[a-zA-Z]/.test(codeStr) || codeStr.includes('-')) {
    return codeStr;
  }

  // Prepend series acronym/name for clean badge display (e.g. BABY-08, SPECTA-41, ZIGNA-05)
  const prefix = (series || 'UND').trim();
  return `${prefix}-${codeStr}`;
}

export function mapRawItemToInvitation(raw: RawAppsScriptItem, index: number): InvitationItem {
  const series = (raw.Series || 'Katalog Undangan').trim();
  const rawCode = raw['Nomor Kode'];
  const formattedCode = formatProductCode(series, rawCode);
  const primaryColor = (raw['Warna Dominan'] || 'Putih').trim();
  const secondaryColor = (raw['Warna Sekunder'] || 'Emas').trim();
  const folding = (raw.Lipatan || 'Lipat 2').trim();
  const orientation = normalizeOrientation(raw['Orientasi Layout']);
  const envelope = (raw.Amplop || 'Tanpa Amplop').trim();
  const hasEnvelope = envelope.toLowerCase().includes('dengan');
  const priceSegment = normalizeSegment(raw['Segmen Harga']);
  const imageFilename = raw['Lihat Drive'] || '';
  const driveUrl = raw.DriveUrl || '';
  const thumbnailUrl = raw.ThumbnailUrl || '';

  // Use ThumbnailUrl, fallback to default cover
  const image = thumbnailUrl.trim() || DEFAULT_FALLBACK_COVER;

  // Paper & dimensions metadata
  let paperType = 'Concorde Linen 260gsm';
  if (priceSegment === 'SUPER HEMAT') paperType = 'BC Super White 210gsm';
  else if (priceSegment === 'EKONOMIS') paperType = 'Art Carton 230gsm Doff';
  else if (priceSegment === 'MENENGAH') paperType = 'Jasmine Shimmer 230gsm';
  else if (priceSegment === 'PREMIUM') paperType = 'Hardcover Linen / Beludru';

  const dimensions =
    orientation === 'Lanskap'
      ? '21 cm x 15 cm'
      : orientation === 'Persegi'
      ? '15 cm x 15 cm'
      : '15 cm x 21 cm';

  return {
    id: `item-${series}-${rawCode || index}`,
    series,
    code: formattedCode,
    primaryColor,
    secondaryColor,
    folding,
    orientation,
    envelope,
    priceSegment,
    imageFilename,
    driveUrl,
    thumbnailUrl,

    // Aliases
    title: series,
    description: `Undangan seri ${series} dengan konsep ${folding} dan format ${orientation}.`,
    segment: priceSegment,
    primaryColorName: primaryColor,
    primaryColorHex: getColorHex(primaryColor),
    secondaryColorName: secondaryColor,
    secondaryColorHex: getColorHex(secondaryColor),
    foldingType: folding,
    hasEnvelope,
    image,
    paperType,
    dimensions,
    envelopeType: envelope,
    foilType: secondaryColor,
    popularityScore: 90 - (index % 30),
    releaseDate: '2025-01-01',
  };
}

export async function fetchCatalogFromAppsScript(): Promise<InvitationItem[]> {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      // Google Apps Script redirect behavior
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Gagal menghubungi Google Apps Script`);
    }

    const json: AppsScriptResponse = await response.json();

    if (json.status !== 'success' || !Array.isArray(json.data)) {
      throw new Error('Format data Google Apps Script tidak valid atau status bukan success');
    }

    const items = json.data.map((item, idx) => mapRawItemToInvitation(item, idx));

    // Save to cache for offline availability
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(items));
      localStorage.setItem(`${CACHE_KEY}_time`, new Date().toISOString());
    } catch {
      // ignore storage errors
    }

    return items;
  } catch (error) {
    // If network fails, check if we have cached data
    const cached = getCachedCatalog();
    if (cached && cached.length > 0) {
      console.warn('Menggunakan data cache lokal karena koneksi Apps Script terkendala:', error);
      return cached;
    }
    throw error;
  }
}

export function getCachedCatalog(): InvitationItem[] | null {
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export function getCachedTime(): string | null {
  try {
    return localStorage.getItem(`${CACHE_KEY}_time`);
  } catch {
    return null;
  }
}
