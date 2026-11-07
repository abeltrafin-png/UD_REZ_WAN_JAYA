import React, { useState } from 'react';

export interface FilterState {
  segment: string;
  primaryColor: string;
  secondaryColor: string;
  foldingType: string;
  orientation: string;
  hasEnvelope: string;
}

interface ParameterFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
  totalFiltered: number;
  totalCatalog: number;
  startIndex: number;
  endIndex: number;
  sortLabel: string;
  availableColors?: string[];
  availableFoldings?: string[];
}

export const ParameterFilters: React.FC<ParameterFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  isFiltered,
  totalFiltered,
  totalCatalog,
  startIndex,
  endIndex,
  sortLabel,
  availableColors = [
    'Cokelat',
    'Biru',
    'Pink',
    'Hitam',
    'Krem',
    'Hijau',
    'Kuning / Emas',
    'Putih',
    'Ungu',
    'Abu-abu',
    'Merah',
  ],
  availableFoldings = ['Lipat 2', 'Lipat 3', 'Single Card'],
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  // Count active specific filters
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <section aria-label="Filter Parameter Produk" className="w-full px-3.5 sm:px-6 py-2.5 sm:py-3 bg-[#f1f3ff] border-b border-[#dce2f7]">
      {/* Mobile Accordion Header Bar (< 1024px) */}
      <div className="flex items-center justify-between gap-2 lg:hidden">
        <button
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          aria-expanded={isMobileExpanded}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-[#dec1af]/70 text-[#141b2b] text-[13px] font-semibold flex items-center gap-2 shadow-2xs hover:border-[#f57c00] transition-colors cursor-pointer flex-1 sm:flex-none justify-between sm:justify-start"
        >
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[19px] text-[#964900]">tune</span>
            <span>Filter Spesifikasi</span>
            {activeCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#f57c00] text-white text-[10.5px] font-bold">
                {activeCount}
              </span>
            )}
          </div>
          <span className="material-symbols-outlined text-[18px] text-[#8b7263]">
            {isMobileExpanded ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-[#e9edff] hover:bg-[#dce2f7] text-[#574235] text-[12px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            title="Bersihkan semua filter"
          >
            <span className="material-symbols-outlined text-[17px]">restart_alt</span>
            <span>Reset</span>
          </button>
        )}

        <div className="text-[12px] text-[#574235] hidden sm:block shrink-0">
          <strong className="text-[#141b2b]">{totalFiltered}</strong> Produk
        </div>
      </div>

      {/* Filter Options: Hidden on mobile unless expanded, always visible on lg+ */}
      <div className={`${isMobileExpanded ? 'block mt-3' : 'hidden'} lg:block`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Dropdown selectors group: 1-col on mobile, 2-col on sm, flex-wrap on lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap items-center gap-2 flex-1">
            {/* Segmen Harga Filter */}
            <div className="relative w-full lg:w-auto lg:min-w-[130px]">
              <label htmlFor="filter-segment" className="sr-only">Filter Berdasarkan Segmen</label>
              <select
                id="filter-segment"
                value={filters.segment}
                onChange={(e) => onFilterChange('segment', e.target.value)}
                className="w-full min-h-[44px] sm:min-h-[38px] pl-3 pr-8 rounded-lg bg-white text-[#141b2b] text-[13px] sm:text-[11.5px] font-semibold shadow-xs border border-[#dec1af]/60 focus:outline-none focus:ring-2 focus:ring-[#f57c00]/20 appearance-none cursor-pointer"
              >
                <option value="">Segmen: Semua</option>
                <option value="SUPER HEMAT">Super Hemat</option>
                <option value="EKONOMIS">Ekonomis</option>
                <option value="MENENGAH">Menengah</option>
                <option value="PREMIUM">Premium</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Warna Dominan Filter */}
            <div className="relative w-full lg:w-auto lg:min-w-[130px]">
              <label htmlFor="filter-primary-color" className="sr-only">Filter Warna Dominan</label>
              <select
                id="filter-primary-color"
                value={filters.primaryColor}
                onChange={(e) => onFilterChange('primaryColor', e.target.value)}
                className="w-full min-h-[44px] sm:min-h-[38px] pl-3 pr-8 rounded-lg bg-white text-[#141b2b] text-[13px] sm:text-[11.5px] font-semibold shadow-xs border border-[#dec1af]/60 focus:outline-none focus:ring-2 focus:ring-[#f57c00]/20 appearance-none cursor-pointer"
              >
                <option value="">Warna Dominan</option>
                {availableColors.map((color) => (
                  <option key={`p-${color}`} value={color}>
                    {color}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Warna Sekunder / Aksen Filter */}
            <div className="relative w-full lg:w-auto lg:min-w-[130px]">
              <label htmlFor="filter-secondary-color" className="sr-only">Filter Warna Sekunder</label>
              <select
                id="filter-secondary-color"
                value={filters.secondaryColor}
                onChange={(e) => onFilterChange('secondaryColor', e.target.value)}
                className="w-full min-h-[44px] sm:min-h-[38px] pl-3 pr-8 rounded-lg bg-white text-[#141b2b] text-[13px] sm:text-[11.5px] font-semibold shadow-xs border border-[#dec1af]/60 focus:outline-none focus:ring-2 focus:ring-[#f57c00]/20 appearance-none cursor-pointer"
              >
                <option value="">Warna Sekunder</option>
                {availableColors.map((color) => (
                  <option key={`s-${color}`} value={color}>
                    {color}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Jenis Lipatan Filter */}
            <div className="relative w-full lg:w-auto lg:min-w-[130px]">
              <label htmlFor="filter-folding" className="sr-only">Filter Jenis Lipatan</label>
              <select
                id="filter-folding"
                value={filters.foldingType}
                onChange={(e) => onFilterChange('foldingType', e.target.value)}
                className="w-full min-h-[44px] sm:min-h-[38px] pl-3 pr-8 rounded-lg bg-white text-[#141b2b] text-[13px] sm:text-[11.5px] font-semibold shadow-xs border border-[#dec1af]/60 focus:outline-none focus:ring-2 focus:ring-[#f57c00]/20 appearance-none cursor-pointer"
              >
                <option value="">Jenis Lipatan</option>
                {availableFoldings.map((fold) => (
                  <option key={fold} value={fold}>
                    {fold}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Orientasi Layout Filter */}
            <div className="relative w-full lg:w-auto lg:min-w-[110px]">
              <label htmlFor="filter-orientation" className="sr-only">Filter Orientasi Layout</label>
              <select
                id="filter-orientation"
                value={filters.orientation}
                onChange={(e) => onFilterChange('orientation', e.target.value)}
                className="w-full min-h-[44px] sm:min-h-[38px] pl-3 pr-8 rounded-lg bg-white text-[#141b2b] text-[13px] sm:text-[11.5px] font-semibold shadow-xs border border-[#dec1af]/60 focus:outline-none focus:ring-2 focus:ring-[#f57c00]/20 appearance-none cursor-pointer"
              >
                <option value="">Orientasi</option>
                <option value="Portrait">Portrait</option>
                <option value="Lanskap">Lanskap</option>
                <option value="Persegi">Persegi</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Status Amplop Filter */}
            <div className="relative w-full lg:w-auto lg:min-w-[125px]">
              <label htmlFor="filter-envelope" className="sr-only">Filter Status Amplop</label>
              <select
                id="filter-envelope"
                value={filters.hasEnvelope}
                onChange={(e) => onFilterChange('hasEnvelope', e.target.value)}
                className="w-full min-h-[44px] sm:min-h-[38px] pl-3 pr-8 rounded-lg bg-white text-[#141b2b] text-[13px] sm:text-[11.5px] font-semibold shadow-xs border border-[#dec1af]/60 focus:outline-none focus:ring-2 focus:ring-[#f57c00]/20 appearance-none cursor-pointer"
              >
                <option value="">Amplop</option>
                <option value="dengan-amplop">Dengan Amplop</option>
                <option value="tanpa-amplop">Tanpa Amplop</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Desktop Reset Button */}
            {isFiltered && (
              <button
                onClick={onResetFilters}
                className="hidden lg:flex min-h-[38px] px-3 rounded-lg bg-[#e9edff] text-[#574235] hover:text-[#964900] hover:bg-[#dce2f7] text-[11px] font-bold items-center gap-1 transition-colors cursor-pointer"
                title="Bersihkan semua filter"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Result Counter & Sort Indicator */}
          <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t border-[#dce2f7]/60 lg:border-t-0">
            <div className="flex items-center gap-1.5 text-[#574235] text-[12px] sm:text-[12.5px]">
              <span className="w-2 h-2 rounded-full bg-[#f57c00] animate-pulse shrink-0"></span>
              <span>
                Menampilkan{' '}
                <strong className="text-[#141b2b] font-bold">
                  {totalFiltered === 0 ? 0 : `${startIndex}–${endIndex}`}
                </strong>{' '}
                dari <strong className="text-[#141b2b] font-bold">{totalFiltered}</strong> Produk
                {totalFiltered !== totalCatalog && (
                  <span className="text-[#8b7263] ml-1">(total {totalCatalog})</span>
                )}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[#8b7263] text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[15px]">sync_alt</span>
              <span>{sortLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
