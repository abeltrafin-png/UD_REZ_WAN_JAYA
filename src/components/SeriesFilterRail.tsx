import React from 'react';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

interface SeriesFilterRailProps {
  selectedSeries: string;
  onSelectSeries: (series: string) => void;
  seriesCounts: Record<string, number>;
  totalCount: number;
  seriesList?: string[];
}

export const SeriesFilterRail: React.FC<SeriesFilterRailProps> = ({
  selectedSeries,
  onSelectSeries,
  seriesCounts,
  totalCount,
  seriesList = ['Semua Series'],
}) => {
  const {
    containerRef,
    canScrollLeft,
    canScrollRight,
    scroll,
    hasMovedRef,
    dragHandlers,
  } = useDraggableScroll();

  return (
    <section
      aria-label="Navigasi Series Undangan"
      className="relative w-full bg-white px-3 sm:px-6 py-2 border-b border-[#e9edff] shadow-2xs select-none"
    >
      {/* Left Scroll Chevron Arrow */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center pl-2 pr-4 bg-gradient-to-r from-white via-white/90 to-transparent">
          <button
            type="button"
            onClick={() => scroll('left', 260)}
            aria-label="Geser seri ke kiri"
            className="w-8 h-8 rounded-full bg-white shadow-md border border-[#dce2f7] text-[#964900] hover:bg-[#f57c00] hover:text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
        </div>
      )}

      {/* Right Scroll Chevron Arrow */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center pr-2 pl-4 bg-gradient-to-l from-white via-white/90 to-transparent">
          <button
            type="button"
            onClick={() => scroll('right', 260)}
            aria-label="Geser seri ke kanan"
            className="w-8 h-8 rounded-full bg-white shadow-md border border-[#dce2f7] text-[#964900] hover:bg-[#f57c00] hover:text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      )}

      {/* Scrollable & Draggable Rail Container */}
      <div
        ref={containerRef}
        {...dragHandlers}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-1 text-[11px] text-[#8b7263] uppercase tracking-wider font-bold whitespace-nowrap pl-0.5 pr-1 shrink-0">
          <span className="material-symbols-outlined text-[16px] text-[#964900]">auto_awesome</span>
          <span>Seri:</span>
          <span className="material-symbols-outlined text-[14px] text-[#8b7263]/70 hidden sm:inline" title="Bisa digeser ke kiri dan kanan">
            swap_horiz
          </span>
        </div>

        {seriesList.map((series) => {
          const isAll = series === 'Semua Series';
          const isSelected = selectedSeries === series || (isAll && (!selectedSeries || selectedSeries === 'Semua Series'));
          const count = isAll ? totalCount : seriesCounts[series] ?? 0;

          return (
            <button
              key={series}
              type="button"
              onClick={() => {
                // If user was dragging/swiping with mouse, prevent accidental click
                if (hasMovedRef.current) return;
                onSelectSeries(isAll ? '' : series);
              }}
              className={`min-h-[42px] sm:min-h-[38px] px-3.5 py-1.5 rounded-full text-[12.5px] whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer select-none shrink-0 active:scale-95 ${
                isSelected
                  ? 'bg-[#f57c00] text-[#572800] font-bold shadow-[0_2px_8px_rgba(245,124,0,0.25)] ring-1 ring-[#9b4500]/20'
                  : 'bg-[#e9edff] text-[#574235] hover:text-[#141b2b] hover:bg-[#dce2f7] font-medium'
              }`}
            >
              <span>{series}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  isSelected
                    ? 'bg-white/40 text-[#572800]'
                    : 'bg-white/70 text-[#8b7263]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
