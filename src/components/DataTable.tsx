import React from 'react';
import { InvitationItem } from '../types/invitation';
import { SEGMENTS } from '../data/initialCatalog';
import { handleImageError } from '../utils/imageFallback';

interface DataTableProps {
  items: InvitationItem[];
  onPreview: (item: InvitationItem) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
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

  return (
    <div className="w-full">
      {/* 1. Mobile Cards View (< 768px) */}
      <div className="md:hidden space-y-3">
        {items.map((item) => {
          const seg = getSegmentMeta(item.segment);

          return (
            <article
              key={`mob-${item.id}`}
              onClick={() => onPreview(item)}
              className="bg-white rounded-2xl p-4 border border-[#dec1af]/50 shadow-xs hover:border-[#f57c00] transition-all cursor-pointer"
            >
              {/* Top Row: Thumbnail + Series & Code + Segment Badge */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f1f3ff] border border-[#dce2f7] shrink-0">
                  <img
                    src={item.image}
                    alt={item.series}
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif font-bold text-[16px] text-[#141b2b] truncate">
                      {item.series}
                    </h3>
                    <span
                      style={{
                        backgroundColor: seg.bg,
                        color: seg.text,
                        borderColor: seg.border,
                      }}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 capitalize"
                    >
                      {seg.name}
                    </span>
                  </div>
                  <div className="font-mono text-[12px] text-[#964900] font-semibold mt-0.5">
                    {item.code}
                  </div>
                  <div className="text-[11.5px] text-[#574235] truncate mt-0.5">
                    {item.paperType}
                  </div>
                </div>
              </div>

              {/* Specifications Pills Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] mb-3 pt-2.5 border-t border-[#f1f3ff]">
                <div className="flex items-center gap-1.5 text-[#293040] bg-[#f4f6ff] px-2.5 py-1.5 rounded-lg">
                  <span className="material-symbols-outlined text-[15px] text-[#8b7263]">view_column</span>
                  <span className="truncate">{item.foldingType}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[#293040] bg-[#f4f6ff] px-2.5 py-1.5 rounded-lg">
                  <span className="material-symbols-outlined text-[15px] text-[#8b7263]">crop_portrait</span>
                  <span className="truncate">{item.orientation}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[#293040] bg-[#f4f6ff] px-2.5 py-1.5 rounded-lg">
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: item.primaryColorHex }}
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: item.secondaryColorHex }}
                    />
                  </div>
                  <span className="truncate">{item.primaryColorName}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[#293040] bg-[#f4f6ff] px-2.5 py-1.5 rounded-lg">
                  <span className="material-symbols-outlined text-[15px] text-[#8b7263]">mail</span>
                  <span className="truncate">{item.hasEnvelope ? 'Dengan Amplop' : 'Tanpa Amplop'}</span>
                </div>
              </div>

              {/* Mobile Full-width Action Button (min 44px) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(item);
                }}
                className="w-full min-h-[44px] rounded-xl bg-[#eef2fe] hover:bg-[#dce2f7] text-[#141b2b] text-[13px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#964900]">visibility</span>
                <span>Lihat Detail Spesifikasi</span>
              </button>
            </article>
          );
        })}
      </div>

      {/* 2. Desktop & Tablet Horizontal Scrollable Table (>= 768px) */}
      <div className="hidden md:block w-full bg-white rounded-2xl shadow-xs border border-[#dec1af]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f6ff] border-b border-[#e9edff] text-[11px] font-bold uppercase tracking-wider text-[#574235]">
                <th scope="col" className="py-4 px-5">1. DESAIN</th>
                <th scope="col" className="py-4 px-5">2. SERIES & KODE</th>
                <th scope="col" className="py-4 px-5">3. WARNA DOMINAN</th>
                <th scope="col" className="py-4 px-5">4. LIPATAN</th>
                <th scope="col" className="py-4 px-5">5. ORIENTASI</th>
                <th scope="col" className="py-4 px-5">6. AMPLOP</th>
                <th scope="col" className="py-4 px-5 text-center">7. KATEGORI</th>
                <th scope="col" className="py-4 px-5 text-center">8. AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3ff] text-[13px] text-[#141b2b]">
              {items.map((item) => {
                const seg = getSegmentMeta(item.segment);

                return (
                  <tr
                    key={`tbl-${item.id}`}
                    className="hover:bg-[#f9f9ff] transition-colors group cursor-pointer"
                    onClick={() => onPreview(item)}
                  >
                    {/* 1. DESAIN */}
                    <td className="py-3.5 px-5 w-20">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#f1f3ff] border border-[#dce2f7] shrink-0 shadow-2xs">
                        <img
                          src={item.image}
                          alt={item.series}
                          loading="lazy"
                          decoding="async"
                          onError={handleImageError}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </td>

                    {/* 2. SERIES & KODE */}
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-[#141b2b] text-[14px] group-hover:text-[#964900] transition-colors">
                        {item.series}
                      </div>
                      <div className="font-mono text-[11px] text-[#8b7263] mt-0.5 tracking-wider">
                        {item.code}
                      </div>
                    </td>

                    {/* 3. WARNA DOMINAN */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
                            style={{ backgroundColor: item.primaryColorHex }}
                            title={item.primaryColorName}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
                            style={{ backgroundColor: item.secondaryColorHex }}
                            title={item.secondaryColorName}
                          />
                        </div>
                        <span className="text-[12px] font-medium text-[#293040]">
                          {item.primaryColorName} / {item.secondaryColorName}
                        </span>
                      </div>
                    </td>

                    {/* 4. LIPATAN */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-md bg-[#eef2fe] text-[#293040] text-[12px] font-medium inline-block">
                        {item.foldingType}
                      </span>
                    </td>

                    {/* 5. ORIENTASI */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#293040]">
                        <span className="material-symbols-outlined text-[16px] text-[#8b7263]">
                          crop_portrait
                        </span>
                        <span>{item.orientation}</span>
                      </div>
                    </td>

                    {/* 6. AMPLOP */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {item.hasEnvelope ? (
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-md bg-[#ecfdf5] text-[#065f46]">
                          <span className="material-symbols-outlined text-[15px]">
                            mail
                          </span>
                          <span>Dengan Amplop</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-md bg-[#f3f4f6] text-[#4b5563]">
                          <span className="material-symbols-outlined text-[15px]">
                            mark_email_read
                          </span>
                          <span>Tanpa Amplop</span>
                        </span>
                      )}
                    </td>

                    {/* 7. KATEGORI */}
                    <td className="py-3.5 px-5 whitespace-nowrap text-center">
                      <span
                        style={{
                          backgroundColor: seg.bg,
                          color: seg.text,
                        }}
                        className="px-3.5 py-1 rounded-full text-[11px] font-bold shadow-2xs capitalize inline-block"
                      >
                        {seg.name}
                      </span>
                    </td>

                    {/* 8. AKSI (min-w 44px min-h 44px) */}
                    <td
                      className="py-3.5 px-5 text-center whitespace-nowrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreview(item);
                      }}
                    >
                      <button
                        type="button"
                        className="min-w-[44px] min-h-[44px] rounded-full text-[#574235] hover:text-[#964900] hover:bg-[#eef2fe] transition-colors inline-flex items-center justify-center cursor-pointer"
                        title="Lihat Pratinjau Undangan"
                        aria-label={`Lihat pratinjau ${item.series}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
