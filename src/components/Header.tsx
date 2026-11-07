import React, { useState, useEffect } from 'react';
import { ViewMode, SortOption, SegmentTier } from '../types/invitation';
import { SEGMENTS } from '../data/initialCatalog';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

interface HeaderProps {
  totalCount: number;
  segmentCounts: Record<SegmentTier, number>;
  selectedSegment: string;
  onSelectSegment: (segment: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastSyncTime?: Date | null;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  segmentCounts,
  selectedSegment,
  onSelectSegment,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  isRefreshing = false,
  lastSyncTime = null,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    containerRef: priceRailRef,
    canScrollLeft: canScrollPriceLeft,
    canScrollRight: canScrollPriceRight,
    scroll: scrollPrice,
    hasMovedRef: priceHasMovedRef,
    dragHandlers: priceDragHandlers,
  } = useDraggableScroll();

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSelectViewMode = (mode: ViewMode) => {
    onViewModeChange(mode);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#dce2f7]">
      {/* Primary Top Bar: Brand, Logo, Verified Count, and Mobile Hamburger */}
      <div className="w-full px-3.5 sm:px-6 py-2.5 sm:py-3 border-b border-[#e9edff] flex items-center justify-between gap-3">
        {/* Brand Identity - Refined Atelier & Print Studio Aesthetic */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 min-w-0">
          {/* Logo Frame */}
          <div className="relative p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#fff9f4] via-[#ffffff] to-[#f4f6ff] border border-[#dec1af]/70 shadow-xs flex items-center justify-center shrink-0 group transition-all duration-300 hover:shadow-md hover:border-[#f57c00]/50">
            <img
              alt="Logo"
              title="Logo"
              className="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UyxsX4j-OkCArZ6JY7dk31eB53Jv4WnycTKzFYop1zzFONuBB9Vc16Hi8Ro_XlT-TUqoyScsuhoY9F7bHQ7Z4zKbgIXrTfsKRChiTS-1Lrp5ez05Yh-82EpIcYqKPlsUWmcFmA5uPhx7REFR_zvjeYmyWqF76TXTd_HhWH3ZBiYeGp1ZX5lOPw9aNqUHbrcZvOU0MiC8Suj6Ir5w3LLuhiSEVG59o2iDFL2liPJdd1"
            />
          </div>

          {/* Typography Bay */}
          <div className="flex flex-col min-w-0 justify-center">
            {/* Top Eyebrow: Company Name */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f57c00] shrink-0 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] md:text-[11.5px] tracking-[0.16em] uppercase text-[#964900] font-extrabold truncate">
                UD REZ WAN JAYA
              </span>
            </div>

            {/* Main Title: Katalog Galeri Undangan */}
            <h1 className="text-[16px] sm:text-[20px] md:text-[23px] font-serif font-bold tracking-tight text-[#141b2b] leading-tight truncate">
              <span>Katalog Galeri </span>
              <span className="italic font-normal text-[#964900]">Undangan</span>
            </h1>
          </div>

          {/* Verified Designs Badge - Desktop */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e9edff] text-[#574235] text-[11px] font-semibold border border-[#dce2f7] shrink-0 ml-1">
            <span className="material-symbols-outlined text-[16px] text-[#964900]">verified</span>
            <span className="font-bold text-[#141b2b]">{totalCount} Desain</span> Terverifikasi
          </div>
        </div>

        {/* Right Action Area */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Refresh Button for desktop/tablet */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Sinkronkan data katalog dari Google Spreadsheet"
              title={
                lastSyncTime
                  ? `Terakhir sinkron: ${lastSyncTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}\nKlik untuk memperbarui dari Google Spreadsheet`
                  : 'Sinkronkan data dari Google Spreadsheet'
              }
              className="hidden sm:inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 rounded-lg border border-[#dec1af] bg-white text-[12px] font-semibold text-[#574235] hover:text-[#964900] hover:border-[#f57c00] transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
            >
              <span className={`material-symbols-outlined text-[18px] text-[#964900] ${isRefreshing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span className="hidden md:inline">
                {isRefreshing ? 'Menyinkron...' : 'Sinkron'}
              </span>
            </button>
          )}

          {/* Desktop View Mode Switcher */}
          <nav aria-label="Mode Tampilan Desktop" className="hidden md:flex items-center p-1 bg-[#e9edff] rounded-lg text-[12px] font-semibold shrink-0">
            <button
              onClick={() => handleSelectViewMode('galeri-grid-4-kolom')}
              className={`min-h-[38px] px-3 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'galeri-grid-4-kolom'
                  ? 'bg-[#f57c00] text-[#572800] font-bold shadow-xs'
                  : 'text-[#574235] hover:text-[#141b2b]'
              }`}
              title="Tampilan Grid 4 Kolom"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span className="hidden lg:inline">Grid 4 Kolom</span>
            </button>
            <button
              onClick={() => handleSelectViewMode('galeri-compact-6-kolom')}
              className={`min-h-[38px] px-3 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'galeri-compact-6-kolom'
                  ? 'bg-[#f57c00] text-[#572800] font-bold shadow-xs'
                  : 'text-[#574235] hover:text-[#141b2b]'
              }`}
              title="Tampilan Grid Compact 6 Kolom"
            >
              <span className="material-symbols-outlined text-[16px]">view_compact</span>
              <span className="hidden lg:inline">Compact 6</span>
            </button>
            <button
              onClick={() => handleSelectViewMode('galeri-tabel-data')}
              className={`min-h-[38px] px-3 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'galeri-tabel-data'
                  ? 'bg-[#f57c00] text-[#572800] font-bold shadow-xs'
                  : 'text-[#574235] hover:text-[#141b2b]'
              }`}
              title="Tampilan List / Tabel"
            >
              <span className="material-symbols-outlined text-[16px]">table_rows</span>
              <span className="hidden lg:inline">Tabel Data</span>
            </button>
          </nav>

          {/* Mobile Hamburger / Menu Button (Touch Target >= 44x44px) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu navigasi dan tampilan'}
            aria-expanded={isMobileMenuOpen}
            className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg bg-[#e9edff] text-[#574235] hover:text-[#141b2b] hover:bg-[#dce2f7] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search and Sort */}
      <div className="w-full px-3.5 sm:px-6 py-2.5 sm:py-2 bg-[#f9f9ff] border-b border-[#e9edff]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
          {/* Search Input Box */}
          <div className="relative flex-1">
            <label htmlFor="catalog-search" className="sr-only">
              Cari nama seri, kode produk, jenis kertas
            </label>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8b7263] text-[20px] pointer-events-none">
              search
            </span>
            <input
              id="catalog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nama seri, kode produk, kertas..."
              className="w-full min-h-[44px] pl-10 pr-10 rounded-lg border border-[#dec1af] bg-white text-[15px] sm:text-[14px] text-[#141b2b] placeholder:text-[#8b7263]/70 focus:outline-none focus:border-[#f57c00] focus:ring-2 focus:ring-[#f57c00]/20 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Bersihkan pencarian"
                className="absolute right-0 top-0 bottom-0 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#8b7263] hover:text-[#141b2b] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="catalog-sort" className="sr-only">
              Urutkan katalog undangan
            </label>
            <div className="relative w-full sm:w-auto">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                sort
              </span>
              <select
                id="catalog-sort"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="w-full sm:w-auto min-h-[44px] pl-8 pr-8 rounded-lg border border-[#dec1af] bg-white text-[13px] sm:text-[12px] font-semibold text-[#141b2b] focus:outline-none focus:border-[#f57c00] shadow-2xs cursor-pointer appearance-none"
              >
                <option value="series-az">Series & Kode (A–Z)</option>
                <option value="series-za">Series & Kode (Z–A)</option>
                <option value="popular">Model Terpopuler</option>
                <option value="latest">Rilisan Terbaru</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Harga / Segmen: Touch-friendly & Draggable horizontal rail */}
      <nav aria-label="Filter Segmen Harga" className="relative w-full bg-white/90 border-b border-[#e9edff] select-none">
        {/* Left Scroll Chevron Arrow */}
        {canScrollPriceLeft && (
          <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center pl-2 pr-3 bg-gradient-to-r from-white via-white/90 to-transparent">
            <button
              type="button"
              onClick={() => scrollPrice('left', 220)}
              aria-label="Geser kategori harga ke kiri"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-[#dce2f7] text-[#964900] hover:bg-[#f57c00] hover:text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[17px]">chevron_left</span>
            </button>
          </div>
        )}

        {/* Right Scroll Chevron Arrow */}
        {canScrollPriceRight && (
          <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center pr-2 pl-3 bg-gradient-to-l from-white via-white/90 to-transparent">
            <button
              type="button"
              onClick={() => scrollPrice('right', 220)}
              aria-label="Geser kategori harga ke kanan"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-[#dce2f7] text-[#964900] hover:bg-[#f57c00] hover:text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[17px]">chevron_right</span>
            </button>
          </div>
        )}

        <div
          ref={priceRailRef}
          {...priceDragHandlers}
          className="flex items-center gap-2 px-3.5 sm:px-6 py-2 overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center gap-1 text-[11px] text-[#8b7263] uppercase tracking-wider font-bold whitespace-nowrap pl-0.5 shrink-0">
            <span className="material-symbols-outlined text-[15px] text-[#964900]">sell</span>
            <span>Harga:</span>
            <span className="material-symbols-outlined text-[13px] text-[#8b7263]/70 hidden sm:inline" title="Bisa digeser ke kiri dan kanan">
              swap_horiz
            </span>
          </div>

          {SEGMENTS.map((seg) => {
            const isSelected = selectedSegment === seg.id;
            const count = segmentCounts[seg.id as SegmentTier] ?? 0;
            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => {
                  if (priceHasMovedRef.current) return;
                  onSelectSegment(isSelected ? '' : seg.id);
                }}
                style={{
                  backgroundColor: seg.bg,
                  color: seg.text,
                  borderColor: seg.border,
                }}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-full border text-[12px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95 select-none ${
                  isSelected ? 'ring-2 ring-[#f57c00] ring-offset-1 font-extrabold shadow-sm scale-102' : 'hover:opacity-90'
                }`}
                title={`Filter harga: ${seg.name}`}
              >
                <span className="material-symbols-outlined text-[14px]">{seg.icon}</span>
                <span>{seg.name}</span>
                <span className="opacity-80 text-[10.5px]">({count})</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Menu Overlay - High-End Atelier Bottom Sheet */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu Opsi Navigasi dan Tampilan"
          className="fixed inset-0 z-50 bg-[#141b2b]/70 backdrop-blur-sm flex flex-col justify-end md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-full bg-gradient-to-b from-white via-[#fcfdff] to-[#f5f7fd] rounded-t-[32px] p-5 sm:p-6 shadow-[0_-10px_35px_rgba(0,0,0,0.18)] border-t border-white/80 max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Drag Handle Indicator */}
            <div className="w-12 h-1.5 bg-[#dec1af]/70 rounded-full mx-auto mb-4" />

            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#e9edff] mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffeedd] to-[#ffe2c7] border border-[#f57c00]/30 flex items-center justify-center text-[#964900] shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">dashboard_customize</span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[18px] text-[#141b2b] leading-tight">
                    Menu & Tampilan
                  </h3>
                  <p className="text-[11.5px] text-[#8b7263] mt-0.5">
                    Pilih tata letak galeri & kelola katalog
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Tutup menu"
                className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-full bg-[#f1f3ff] text-[#574235] hover:text-[#141b2b] hover:bg-[#e1e8fd] active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Status & Sync Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#fffaf4] via-white to-[#f4f7fe] border border-[#dec1af]/60 shadow-xs mb-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[14px] text-[#141b2b]">{totalCount} Desain</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-[11px] text-[#8b7263]">
                      {lastSyncTime
                        ? `Terakhir sinkron: ${lastSyncTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
                        : 'Terkoneksi langsung ke Spreadsheet'}
                    </p>
                  </div>
                </div>

                {onRefresh && (
                  <button
                    type="button"
                    onClick={() => {
                      onRefresh();
                    }}
                    disabled={isRefreshing}
                    className="min-h-[42px] px-3.5 rounded-xl bg-white border border-[#dec1af] hover:border-[#f57c00] text-[12px] font-bold text-[#964900] flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 transition-all disabled:opacity-60"
                  >
                    <span className={`material-symbols-outlined text-[17px] ${isRefreshing ? 'animate-spin' : ''}`}>
                      sync
                    </span>
                    <span>{isRefreshing ? 'Sinkron...' : 'Sinkron'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* View Mode Section: Interactive Visual Cards */}
            <div className="mb-4">
              <span className="text-[11px] font-bold text-[#8b7263] uppercase tracking-wider block mb-2.5 px-0.5">
                Tata Letak Tampilan
              </span>
              <div className="space-y-2.5">
                {/* 1. Grid 4 Kolom */}
                <button
                  type="button"
                  onClick={() => handleSelectViewMode('galeri-grid-4-kolom')}
                  className={`w-full min-h-[58px] p-3 rounded-2xl flex items-center justify-between border transition-all text-left cursor-pointer active:scale-[0.99] ${
                    viewMode === 'galeri-grid-4-kolom'
                      ? 'bg-gradient-to-r from-[#fff3e6] to-[#fff8f0] border-[#f57c00] shadow-[0_2px_10px_rgba(245,124,0,0.15)] ring-1 ring-[#f57c00]'
                      : 'bg-white border-[#dec1af]/60 hover:bg-[#f1f3ff]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        viewMode === 'galeri-grid-4-kolom'
                          ? 'bg-[#f57c00] text-white shadow-xs'
                          : 'bg-[#f4f6ff] text-[#574235]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">grid_view</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-bold text-[#141b2b]">
                          Grid Galeri (Foto Besar)
                        </span>
                        <span className="px-1.5 py-0.2 rounded-md bg-[#fff0e0] text-[#964900] text-[9.5px] font-extrabold uppercase">
                          Favorit
                        </span>
                      </div>
                      <p className="text-[11px] text-[#574235] mt-0.5">
                        Fokus pada foto mockup, label segmen harga & palet warna
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {viewMode === 'galeri-grid-4-kolom' ? (
                      <span className="material-symbols-outlined text-[22px] text-[#f57c00]">check_circle</span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-[#dec1af] inline-block" />
                    )}
                  </div>
                </button>

                {/* 2. Grid Compact 6 Kolom */}
                <button
                  type="button"
                  onClick={() => handleSelectViewMode('galeri-compact-6-kolom')}
                  className={`w-full min-h-[58px] p-3 rounded-2xl flex items-center justify-between border transition-all text-left cursor-pointer active:scale-[0.99] ${
                    viewMode === 'galeri-compact-6-kolom'
                      ? 'bg-gradient-to-r from-[#fff3e6] to-[#fff8f0] border-[#f57c00] shadow-[0_2px_10px_rgba(245,124,0,0.15)] ring-1 ring-[#f57c00]'
                      : 'bg-white border-[#dec1af]/60 hover:bg-[#f1f3ff]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        viewMode === 'galeri-compact-6-kolom'
                          ? 'bg-[#f57c00] text-white shadow-xs'
                          : 'bg-[#f4f6ff] text-[#574235]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">view_compact</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-bold text-[#141b2b]">
                          Grid Compact (2 Kolom HP)
                        </span>
                        <span className="px-1.5 py-0.2 rounded-md bg-[#eef2fe] text-[#293040] text-[9.5px] font-extrabold uppercase">
                          Ringkas
                        </span>
                      </div>
                      <p className="text-[11px] text-[#574235] mt-0.5">
                        Hemat ruang untuk membandingkan banyak seri dengan cepat
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {viewMode === 'galeri-compact-6-kolom' ? (
                      <span className="material-symbols-outlined text-[22px] text-[#f57c00]">check_circle</span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-[#dec1af] inline-block" />
                    )}
                  </div>
                </button>

                {/* 3. List / Tabel Data */}
                <button
                  type="button"
                  onClick={() => handleSelectViewMode('galeri-tabel-data')}
                  className={`w-full min-h-[58px] p-3 rounded-2xl flex items-center justify-between border transition-all text-left cursor-pointer active:scale-[0.99] ${
                    viewMode === 'galeri-tabel-data'
                      ? 'bg-gradient-to-r from-[#fff3e6] to-[#fff8f0] border-[#f57c00] shadow-[0_2px_10px_rgba(245,124,0,0.15)] ring-1 ring-[#f57c00]'
                      : 'bg-white border-[#dec1af]/60 hover:bg-[#f1f3ff]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        viewMode === 'galeri-tabel-data'
                          ? 'bg-[#f57c00] text-white shadow-xs'
                          : 'bg-[#f4f6ff] text-[#574235]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">table_rows</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-bold text-[#141b2b]">
                          Tabel & List Spesifikasi
                        </span>
                        <span className="px-1.5 py-0.2 rounded-md bg-[#eef2fe] text-[#293040] text-[9.5px] font-extrabold uppercase">
                          Detail
                        </span>
                      </div>
                      <p className="text-[11px] text-[#574235] mt-0.5">
                        Lengkap dengan bahan kertas, jenis lipatan & amplop
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {viewMode === 'galeri-tabel-data' ? (
                      <span className="material-symbols-outlined text-[22px] text-[#f57c00]">check_circle</span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-[#dec1af] inline-block" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Direct Consultation Shortcut via WhatsApp */}
            <div className="mb-3.5">
              <a
                href="https://wa.me/?text=Halo%20UD%20REZ%20WAN%20JAYA%2C%20saya%20tertarik%20tanya%20info%20katalog%20cetak%20undangan."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-[13px] font-bold flex items-center justify-center gap-2 shadow-2xs transition-all"
              >
                <span className="material-symbols-outlined text-[20px] text-emerald-700">chat</span>
                <span>Konsultasi Cetak via WhatsApp</span>
              </a>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full min-h-[48px] rounded-2xl bg-[#eef2fe] hover:bg-[#dce2f7] text-[#293040] text-[13.5px] font-bold transition-colors cursor-pointer"
            >
              Tutup Menu
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
