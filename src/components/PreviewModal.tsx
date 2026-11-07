import React, { useEffect } from 'react';
import { InvitationItem } from '../types/invitation';
import { SEGMENTS } from '../data/initialCatalog';
import { handleImageError } from '../utils/imageFallback';

interface PreviewModalProps {
  item: InvitationItem | null;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  item,
  onClose,
}) => {
  // Close on Escape key and prevent background body scrolling
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  if (!item) return null;

  const seg = SEGMENTS.find((s) => s.id === item.segment) || {
    id: item.segment,
    name: item.segment,
    bg: '#FEF3C7',
    text: '#92400E',
    border: '#FDE68A',
    icon: 'star',
  };

  const handleConsultation = () => {
    const text = encodeURIComponent(
      `Halo UD REZ WAN JAYA, saya tertarik konsultasi cetak untuk undangan ${item.series} (${item.code}). Mohon info detail harga & minimal order.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const formattedCode = item.code.includes('-') ? item.code.replace('-', ' - ') : item.code;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      className="fixed inset-0 z-50 bg-[#293040]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row p-4 sm:p-7 md:p-8 gap-5 md:gap-8 border border-[#dec1af]/40 max-h-[94vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column: Badges, Image, Color Swatches */}
        <div className="w-full md:w-7/12 flex flex-col justify-between">
          <div>
            {/* Top Badges Row */}
            <div className="flex items-center gap-2 mb-3">
              <span
                style={{
                  backgroundColor: seg.bg,
                  color: seg.text,
                  borderColor: seg.border,
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide border flex items-center gap-1.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[13px] fill-current">
                  {seg.icon}
                </span>
                <span>{item.segment}</span>
              </span>

              <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-[#f4f6ff] text-[#293040] border border-[#dce2f7] shadow-2xs tracking-wider">
                {formattedCode}
              </span>
            </div>

            {/* Invitation Showcase Photo */}
            <div className="w-full aspect-[16/10] bg-[#f1f3ff] rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-[#dec1af]/30 select-none">
              <img
                src={item.image}
                alt={`Mockup undangan ${item.series}`}
                loading="eager"
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Color Swatch Dots & Labels below image */}
          <div className="mt-3.5 flex items-center justify-center gap-2 text-[12px] font-medium text-[#293040]">
            <div className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs shrink-0"
                style={{ backgroundColor: item.primaryColorHex }}
              />
              <span>{item.primaryColorName}</span>
            </div>
            <span className="text-[#8b7263]">•</span>
            <div className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs shrink-0"
                style={{ backgroundColor: item.secondaryColorHex }}
              />
              <span>{item.foilType || item.secondaryColorName}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Code, Specifications Rows, Action Buttons */}
        <div className="w-full md:w-5/12 flex flex-col justify-between pt-2 md:pt-0 border-t md:border-t-0 border-[#f1f3ff]">
          <div>
            {/* Header with Title, Code & Accessible Close Button */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2
                  id="preview-modal-title"
                  className="text-[20px] sm:text-[24px] md:text-[26px] font-serif font-bold text-[#141b2b] leading-tight"
                >
                  {item.series}
                </h2>
                <div className="text-[12px] font-mono text-[#8b7263] mt-0.5">
                  Kode Produk: {item.code}
                </div>
              </div>

              {/* Close Button Top Right (min-w 44px min-h 44px for touch) */}
              <button
                type="button"
                onClick={onClose}
                className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[#f1f4ff] hover:bg-[#e1e8fd] text-[#574235] hover:text-[#141b2b] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Tutup pratinjau"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Specifications Strip Container */}
            <div className="space-y-2 text-[12px]">
              {/* Row 1: Segmen Harga */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#f4f6ff] rounded-xl">
                <div className="flex items-center gap-2 text-[#574235]">
                  <span className="material-symbols-outlined text-[17px] text-[#8b7263]">
                    sell
                  </span>
                  <span>Segmen Harga</span>
                </div>
                <span className="font-bold text-[#141b2b] capitalize">{seg.name}</span>
              </div>

              {/* Row 2: Bahan Kertas */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#f4f6ff] rounded-xl">
                <div className="flex items-center gap-2 text-[#574235]">
                  <span className="material-symbols-outlined text-[17px] text-[#8b7263]">
                    texture
                  </span>
                  <span>Bahan Kertas</span>
                </div>
                <span className="font-bold text-[#141b2b] text-right truncate max-w-[170px]">
                  {item.paperType}
                </span>
              </div>

              {/* Row 3: Jenis Lipatan */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#f4f6ff] rounded-xl">
                <div className="flex items-center gap-2 text-[#574235]">
                  <span className="material-symbols-outlined text-[17px] text-[#8b7263]">
                    view_column
                  </span>
                  <span>Jenis Lipatan</span>
                </div>
                <span className="font-bold text-[#141b2b]">{item.foldingType}</span>
              </div>

              {/* Row 4: Orientasi */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#f4f6ff] rounded-xl">
                <div className="flex items-center gap-2 text-[#574235]">
                  <span className="material-symbols-outlined text-[17px] text-[#8b7263]">
                    crop_portrait
                  </span>
                  <span>Orientasi</span>
                </div>
                <span className="font-bold text-[#141b2b]">{item.orientation}</span>
              </div>

              {/* Row 5: Jenis Amplop */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#f4f6ff] rounded-xl">
                <div className="flex items-center gap-2 text-[#574235]">
                  <span className="material-symbols-outlined text-[17px] text-[#8b7263]">
                    mail
                  </span>
                  <span>Jenis Amplop</span>
                </div>
                <span className="font-bold text-[#141b2b] text-right">
                  {item.envelopeType}
                </span>
              </div>

              {/* Row 6: Warna Dominan / Aksen */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#f4f6ff] rounded-xl">
                <div className="flex items-center gap-2 text-[#574235]">
                  <span className="material-symbols-outlined text-[17px] text-[#8b7263]">
                    palette
                  </span>
                  <span>Warna Dominan / Aksen</span>
                </div>
                <span className="font-bold text-[#141b2b] text-right">
                  {item.primaryColorName.split(' ')[0]} / {item.secondaryColorName.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons (Touch friendly min 48px height) */}
          <div className="space-y-2 mt-5 pt-2">
            <button
              type="button"
              onClick={handleConsultation}
              className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-[#f57c00] hover:bg-[#e65100] active:scale-[0.99] text-white text-[13.5px] font-bold flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(245,124,0,0.25)] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              <span>Konsultasi Cetak Seri Ini</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#eef2fe] hover:bg-[#dce2f7] text-[#293040] text-[13px] font-bold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
