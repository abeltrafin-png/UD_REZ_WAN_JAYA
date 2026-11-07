export type SegmentTier = 'PREMIUM' | 'MENENGAH' | 'EKONOMIS' | 'SUPER HEMAT';

export type OrientationType = 'Portrait' | 'Lanskap' | 'Persegi';

export interface RawAppsScriptItem {
  Series: string;
  'Nomor Kode': string | number;
  'Warna Dominan': string;
  'Warna Sekunder': string;
  Lipatan: string;
  'Orientasi Layout': string;
  Amplop: string;
  'Segmen Harga': string;
  'Lihat Drive': string;
  DriveUrl: string;
  ThumbnailUrl: string;
}

export interface AppsScriptResponse {
  status: string;
  data: RawAppsScriptItem[];
}

export interface InvitationItem {
  id: string;
  // Standard mapped properties from Google Spreadsheet / Apps Script
  series: string;
  code: string;
  primaryColor: string;
  secondaryColor: string;
  folding: string;
  orientation: OrientationType;
  envelope: string;
  priceSegment: SegmentTier;
  imageFilename: string;
  driveUrl: string;
  thumbnailUrl: string;

  // UI convenience aliases for components
  title: string;
  description: string;
  segment: SegmentTier;
  primaryColorName: string;
  primaryColorHex: string;
  secondaryColorName: string;
  secondaryColorHex: string;
  foldingType: string;
  hasEnvelope: boolean;
  image: string;
  paperType: string;
  dimensions: string;
  envelopeType: string;
  printTechnique?: string;
  foilType?: string;
  driveFolderUrl?: string;
  popularityScore?: number;
  releaseDate?: string;
}

export type ViewMode = 'galeri-grid-4-kolom' | 'galeri-compact-6-kolom' | 'galeri-tabel-data';

export type SortOption = 'series-az' | 'series-za' | 'popular' | 'latest';
