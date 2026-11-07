import React from 'react';
import { InvitationItem } from '../types/invitation';
import { SEGMENTS } from '../data/initialCatalog';
import { handleImageError } from '../utils/imageFallback';

interface CardGrid4Props {
  items: InvitationItem[];
  onPreview: (item: InvitationItem) => void;
}

export const CardGrid4: React.FC<CardGrid4Props> = ({
  items,
  onPreview,
}) => {
  const getSegmentMeta = (segment: string) => {
    return (
      SEGMENTS.find((s) => s.id === segment) || {
        id: segment,
        name: segment,
        bg: '#FEF3C7',
        text: '#92400E',
        border: '#FDE68A',
        icon: 'star',
      }
    );
  };

  const getFoldingIcon = (folding: string) => {
    if (folding.includes('Gatefold') || folding.includes('splitscreen')) return 'splitscreen';
    if (folding.includes('Z-Fold') || folding.includes('density_medium')) return 'density_medium';
    if (folding.includes('Horizontal') || folding.includes('view_stream')) return 'view_stream';
    if (folding.includes('Hardcover') || folding.includes('inventory_2')) return 'inventory_2';
    if (folding.includes('Single')) return 'crop_portrait';
    return 'view_column';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {items.map((item) => {
        const seg = getSegmentMeta(item.segment);

        return (
          <article
            key={item.id}
            onClick={() => onPreview(item)}
            className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#dec1af]/40 cursor-pointer"
          >
            {/* Visual Display Framing Box */}
            <div className="relative w-full aspect-[4/3] bg-[#f1f3ff] overflow-hidden flex items-center justify-center p-3 select-none">
              <img
                src={item.image}
                alt={`Undangan seri ${item.series}`}
                loading="lazy"
                decoding="async"
                onError={handleImageError}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 shadow-sm"
              />

              {/* Segment Badge Tag (Top Left) */}
              <div className="absolute top-3.5 left-3.5 z-10">
                <span
                  style={{
                    backgroundColor: seg.bg,
                    color: seg.text,
                    borderColor: seg.border,
                  }}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide shadow-xs flex items-center gap-1.5 border"
                >
                  <span className="material-symbols-outlined text-[13px] fill-current">
                    {seg.icon}
                  </span>
                  <span>{item.segment}</span>
                </span>
              </div>

              {/* Color Swatches Overlay (Top Right) */}
              <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full shadow-sm border border-white">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner"
                  style={{ backgroundColor: item.primaryColorHex }}
                  title={`Warna Dominan: ${item.primaryColorName}`}
                />
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner"
                  style={{ backgroundColor: item.secondaryColorHex }}
                  title={`Warna Sekunder: ${item.secondaryColorName}`}
                />
              </div>

              {/* Desktop Hover Action Overlay */}
              <div className="hidden sm:flex absolute inset-0 bg-[#293040]/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center p-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(item);
                  }}
                  className="min-h-[44px] py-2.5 px-5 rounded-lg bg-white text-[#141b2b] text-[13px] font-bold hover:bg-[#964900] hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer transform group-hover:scale-105"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span>Lihat Pratinjau</span>
                </button>
              </div>
            </div>

            {/* Information Bay */}
            <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
              {/* Row 1: Series Name & SKU Code */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <h2 className="text-[18px] sm:text-[20px] text-[#141b2b] font-serif font-bold group-hover:text-[#964900] transition-colors leading-tight">
                    {item.series}
                  </h2>
                  <span className="text-[11px] font-mono font-semibold text-[#8b7263] shrink-0 tracking-wider bg-[#f1f3ff] px-2 py-0.5 rounded-md">
                    {item.code.includes('-') ? item.code.replace('-', ' - ') : item.code}
                  </span>
                </div>

                {/* Row 2: Metadata Badges Strip */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1 mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#eef2fe] text-[#293040] font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#574235]">
                      {getFoldingIcon(item.foldingType)}
                    </span>
                    <span>{item.foldingType}</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-md bg-[#eef2fe] text-[#293040] font-medium">
                    {item.orientation}
                  </span>

                  <span className="px-2.5 py-1 rounded-md bg-[#eef2fe] text-[#293040] font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#574235]">
                      mail
                    </span>
                    <span>{item.hasEnvelope ? 'Dengan Amplop' : 'Tanpa Amplop'}</span>
                  </span>
                </div>
              </div>

              {/* Mobile Explicit Touch Action Button (min-h-[44px]) */}
              <div className="sm:hidden pt-2 border-t border-[#f1f3ff]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(item);
                  }}
                  className="w-full min-h-[44px] rounded-xl bg-[#f4f6ff] active:bg-[#e1e8fd] text-[#964900] text-[12.5px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span>Lihat Detail Spesifikasi</span>
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
