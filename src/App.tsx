/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { InvitationItem, ViewMode, SortOption, SegmentTier } from './types/invitation';
import { fetchCatalogFromAppsScript } from './services/catalogService';
import { Header } from './components/Header';
import { SeriesFilterRail } from './components/SeriesFilterRail';
import { ParameterFilters, FilterState } from './components/ParameterFilters';
import { CardGrid4 } from './components/CardGrid4';
import { CardGridCompact6 } from './components/CardGridCompact6';
import { DataTable } from './components/DataTable';
import { PreviewModal } from './components/PreviewModal';
import { FooterPagination } from './components/FooterPagination';

export default function App() {
  const [catalog, setCatalog] = useState<InvitationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const [selectedSeries, setSelectedSeries] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('series-az');
  const [viewMode, setViewMode] = useState<ViewMode>('galeri-grid-4-kolom');

  const [filters, setFilters] = useState<FilterState>({
    segment: '',
    primaryColor: '',
    secondaryColor: '',
    foldingType: '',
    orientation: '',
    hasEnvelope: '',
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);

  // Lightbox Preview Modal
  const [previewItem, setPreviewItem] = useState<InvitationItem | null>(null);

  // Fetch data from Google Apps Script Web App
  const loadCatalog = useCallback(async (isBackground = false) => {
    if (isBackground) {
      setIsSyncing(true);
    } else {
      setIsLoading(true);
      setError(null);
    }

    try {
      const items = await fetchCatalogFromAppsScript();
      if (items && items.length > 0) {
        setCatalog(items);
        setLastSyncTime(new Date());
        setError(null);
      } else if (!isBackground) {
        setError('Data katalog dari Google Spreadsheet kosong.');
      }
    } catch (err: unknown) {
      console.error('Gagal mengambil data katalog dari Google Apps Script:', err);
      const errMsg = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data.';
      if (!isBackground) {
        setError(errMsg);
      }
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // Initial load and periodic background auto-refresh every 60 seconds
  useEffect(() => {
    loadCatalog(false);

    // Refresh berkala setiap 60 detik agar perubahan Spreadsheet langsung terlihat tanpa refresh manual
    const interval = setInterval(() => {
      loadCatalog(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [loadCatalog]);

  // Dynamic Series List from active catalog
  const dynamicSeriesList = useMemo(() => {
    const set = new Set<string>();
    catalog.forEach((item) => {
      if (item.series && item.series.trim()) {
        set.add(item.series.trim());
      }
    });
    return ['Semua Series', ...Array.from(set).sort()];
  }, [catalog]);

  // Dynamic Primary Colors for filter pills
  const availableColors = useMemo(() => {
    const set = new Set<string>();
    catalog.forEach((item) => {
      if (item.primaryColorName && item.primaryColorName.trim()) {
        set.add(item.primaryColorName.trim());
      }
    });
    return Array.from(set).sort();
  }, [catalog]);

  // Dynamic Folding Types for filter dropdown
  const availableFoldings = useMemo(() => {
    const set = new Set<string>();
    catalog.forEach((item) => {
      if (item.foldingType && item.foldingType.trim()) {
        set.add(item.foldingType.trim());
      }
    });
    return Array.from(set).sort();
  }, [catalog]);

  // Counts by series
  const seriesCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    catalog.forEach((item) => {
      counts[item.series] = (counts[item.series] || 0) + 1;
    });
    return counts;
  }, [catalog]);

  // Counts by segment (SUPER HEMAT, EKONOMIS, MENENGAH, PREMIUM)
  const segmentCounts = useMemo(() => {
    const counts: Record<SegmentTier, number> = {
      'SUPER HEMAT': 0,
      'EKONOMIS': 0,
      'MENENGAH': 0,
      'PREMIUM': 0,
    };
    catalog.forEach((item) => {
      if (counts[item.segment] !== undefined) {
        counts[item.segment]++;
      }
    });
    return counts;
  }, [catalog]);

  // Filter Handler
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedSeries('');
    setSearchQuery('');
    setFilters({
      segment: '',
      primaryColor: '',
      secondaryColor: '',
      foldingType: '',
      orientation: '',
      hasEnvelope: '',
    });
    setCurrentPage(1);
  };

  const isFiltered = Boolean(
    selectedSeries ||
      searchQuery ||
      filters.segment ||
      filters.primaryColor ||
      filters.secondaryColor ||
      filters.foldingType ||
      filters.orientation ||
      filters.hasEnvelope
  );

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return catalog.filter((item) => {
      // Series filter
      if (selectedSeries && selectedSeries !== 'Semua Series' && item.series !== selectedSeries) {
        return false;
      }
      // Search (matches code, series, paper, folding)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          item.code.toLowerCase().includes(q) ||
          item.series.toLowerCase().includes(q) ||
          item.paperType.toLowerCase().includes(q) ||
          item.foldingType.toLowerCase().includes(q) ||
          item.primaryColorName.toLowerCase().includes(q) ||
          item.secondaryColorName.toLowerCase().includes(q);
        if (!match) return false;
      }
      // Segment filter
      if (filters.segment && item.segment !== filters.segment) {
        return false;
      }
      // Primary color
      if (filters.primaryColor && !item.primaryColorName.toLowerCase().includes(filters.primaryColor.toLowerCase())) {
        return false;
      }
      // Secondary color
      if (filters.secondaryColor && !item.secondaryColorName.toLowerCase().includes(filters.secondaryColor.toLowerCase())) {
        return false;
      }
      // Folding
      if (filters.foldingType && !item.foldingType.toLowerCase().includes(filters.foldingType.toLowerCase())) {
        return false;
      }
      // Orientation
      if (filters.orientation && item.orientation !== filters.orientation) {
        return false;
      }
      // Envelope
      if (filters.hasEnvelope === 'dengan-amplop' && !item.hasEnvelope) return false;
      if (filters.hasEnvelope === 'tanpa-amplop' && item.hasEnvelope) return false;

      return true;
    }).sort((a, b) => {
      if (sortOption === 'series-az') {
        const seriesCompare = a.series.localeCompare(b.series);
        if (seriesCompare !== 0) return seriesCompare;
        return a.code.localeCompare(b.code, undefined, { numeric: true });
      }
      if (sortOption === 'series-za') {
        const seriesCompare = b.series.localeCompare(a.series);
        if (seriesCompare !== 0) return seriesCompare;
        return b.code.localeCompare(a.code, undefined, { numeric: true });
      }
      if (sortOption === 'popular') {
        return (b.popularityScore || 0) - (a.popularityScore || 0);
      }
      if (sortOption === 'latest') {
        return (b.releaseDate || '').localeCompare(a.releaseDate || '');
      }
      return 0;
    });
  }, [catalog, selectedSeries, searchQuery, filters, sortOption]);

  // Pagination calculation
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, safeCurrentPage, pageSize]);

  const startIndex = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endIndex = Math.min(safeCurrentPage * pageSize, totalItems);

  const sortLabels: Record<SortOption, string> = {
    'series-az': 'A–Z Series',
    'series-za': 'Z–A Series',
    'popular': 'Model Terpopuler',
    'latest': 'Rilisan Terbaru',
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#141b2b] flex flex-col font-sans">
      {/* Main Header */}
      <Header
        totalCount={catalog.length}
        segmentCounts={segmentCounts}
        selectedSegment={filters.segment}
        onSelectSegment={(seg) => handleFilterChange('segment', seg)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={() => loadCatalog(false)}
        isRefreshing={isSyncing || isLoading}
        lastSyncTime={lastSyncTime}
      />

      {/* Main Container below sticky header */}
      <main className="w-full bg-[#f9f9ff] flex-1 flex flex-col">
        {/* Series Quick Filter Navigation Rail */}
        <SeriesFilterRail
          selectedSeries={selectedSeries}
          onSelectSeries={(series) => {
            setSelectedSeries(series);
            setCurrentPage(1);
          }}
          seriesCounts={seriesCounts}
          totalCount={catalog.length}
          seriesList={dynamicSeriesList}
        />

        {/* Advanced Parameter Filters Strip */}
        <ParameterFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
          totalFiltered={totalItems}
          totalCatalog={catalog.length}
          startIndex={startIndex}
          endIndex={endIndex}
          sortLabel={sortLabels[sortOption]}
          availableColors={availableColors}
          availableFoldings={availableFoldings}
        />

        {/* Main Content Area */}
        <div className="w-full px-3.5 sm:px-6 py-4 sm:py-6 md:py-8 flex-1">
          {/* 1. Loading State */}
          {isLoading && catalog.length === 0 && (
            <div className="w-full py-12 sm:py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-[#dce2f7] shadow-2xs p-5 sm:p-8 max-w-2xl mx-auto">
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-full border-4 border-[#ffddb9] border-t-[#f57c00] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px] text-[#964900]">database</span>
                </div>
              </div>
              <h3 className="font-serif font-bold text-[18px] sm:text-[20px] text-[#141b2b] mb-2">
                Memuat Katalog Undangan...
              </h3>
              <p className="text-[13px] text-[#574235] max-w-md leading-relaxed">
                Menghubungkan dan menyinkronkan data langsung dari Google Spreadsheet melalui Google Apps Script. Mohon tunggu sebentar.
              </p>
            </div>
          )}

          {/* 2. Error State */}
          {!isLoading && error && catalog.length === 0 && (
            <div className="w-full py-12 sm:py-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-red-200 shadow-2xs p-5 sm:p-8 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-4">
                <span className="material-symbols-outlined text-[32px]">cloud_off</span>
              </div>
              <h3 className="font-serif font-bold text-[18px] sm:text-[20px] text-[#141b2b] mb-2">
                Gagal Memuat Data Katalog
              </h3>
              <p className="text-[12.5px] text-red-700 bg-red-50 px-3.5 py-2 rounded-lg border border-red-100 max-w-lg mb-4 text-center font-mono break-words">
                {error}
              </p>
              <p className="text-[13px] text-[#574235] max-w-md mb-6 leading-relaxed">
                Pastikan Web App Google Apps Script memiliki akses publik (Anyone) dan koneksi internet stabil.
              </p>
              <button
                type="button"
                onClick={() => loadCatalog(false)}
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#f57c00] hover:bg-[#9b4500] text-white font-bold text-[13px] transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                <span>Coba Muat Ulang</span>
              </button>
            </div>
          )}

          {/* 3. Empty State (No Search/Filter Match) */}
          {!isLoading && catalog.length > 0 && totalItems === 0 && (
            <div className="w-full py-12 sm:py-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-[#dec1af] p-5 sm:p-6 shadow-2xs max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#964900] mb-3">
                <span className="material-symbols-outlined text-[32px]">filter_alt_off</span>
              </div>
              <h3 className="font-serif font-bold text-[18px] sm:text-[20px] text-[#141b2b] mb-1">
                Tidak ada desain undangan yang cocok
              </h3>
              <p className="text-[13px] text-[#574235] max-w-md mb-5 leading-relaxed">
                Coba sesuaikan kata kunci pencarian atau bersihkan parameter filter untuk melihat koleksi lainnya.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#f57c00] text-[#572800] hover:bg-[#9b4500] hover:text-white font-bold text-[13px] transition-colors cursor-pointer shadow-xs"
              >
                Reset Semua Filter
              </button>
            </div>
          )}

          {/* 4. Catalog Displays */}
          {catalog.length > 0 && totalItems > 0 && (
            <>
              {viewMode === 'galeri-grid-4-kolom' && (
                <CardGrid4
                  items={paginatedItems}
                  onPreview={setPreviewItem}
                />
              )}

              {viewMode === 'galeri-compact-6-kolom' && (
                <CardGridCompact6
                  items={paginatedItems}
                  onPreview={setPreviewItem}
                />
              )}

              {viewMode === 'galeri-tabel-data' && (
                <DataTable
                  items={paginatedItems}
                  onPreview={setPreviewItem}
                />
              )}
            </>
          )}
        </div>

        {/* Complete Pagination and Catalog Status Bottom Area */}
        {catalog.length > 0 && (
          <FooterPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        )}
      </main>

      {/* Lightbox Preview Modal */}
      <PreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
}
