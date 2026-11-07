import { InvitationItem, SegmentTier } from '../types/invitation';

export const INITIAL_CATALOG: InvitationItem[] = [];

export const SERIES_LIST = ['Semua Series'];

export const SEGMENTS: { id: SegmentTier; name: string; bg: string; text: string; border: string; icon: string }[] = [
  { id: 'SUPER HEMAT', name: 'Super Hemat', bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF', icon: 'price_check' },
  { id: 'EKONOMIS', name: 'Ekonomis', bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0', icon: 'savings' },
  { id: 'MENENGAH', name: 'Menengah', bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE', icon: 'workspace_premium' },
  { id: 'PREMIUM', name: 'Premium', bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', icon: 'star' },
];
