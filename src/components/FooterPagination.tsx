import React from 'react';

interface FooterPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  startIndex: number;
  endIndex: number;
}

export const FooterPagination: React.FC<FooterPaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  startIndex,
  endIndex,
}) => {
  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('•••');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('•••');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      {/* Pagination & Status Bar */}
      <footer aria-label="Navigasi Halaman Katalog" className="w-full bg-white px-3.5 sm:px-6 py-4 shadow-sm border-t border-[#e9edff] mt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status & Page Items Selector */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 w-full md:w-auto">
            <span className="text-[12.5px] sm:text-[13px] text-[#574235]">
              Menampilkan <span className="font-bold text-[#141b2b]">{totalItems === 0 ? 0 : `${startIndex}–${endIndex}`}</span> dari{' '}
              <span className="font-bold text-[#141b2b]">{totalItems}</span> produk
            </span>

            <div className="flex items-center gap-2">
              <label htmlFor="page-size-select" className="text-[11px] text-[#8b7263] uppercase font-bold">
                Tampil:
              </label>
              <div className="relative">
                <select
                  id="page-size-select"
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="min-h-[44px] sm:min-h-[38px] pl-3 pr-7 rounded-lg bg-[#e9edff] text-[#141b2b] text-[12px] font-bold focus:outline-none focus:ring-2 focus:ring-[#964900] appearance-none cursor-pointer border border-[#dce2f7]"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                  <option value={96}>96</option>
                </select>
                <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Pagination Buttons (Touch Target >= 44x44px for main controls) */}
          <nav aria-label="Halaman Katalog" className="flex items-center justify-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-[#e9edff] text-[#574235] hover:text-[#141b2b] hover:bg-[#dce2f7] flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              title="Halaman Sebelumnya"
              aria-label="Halaman sebelumnya"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>

            {getPageNumbers().map((p, idx) => {
              if (p === '•••') {
                return (
                  <span key={`dots-${idx}`} className="px-1 text-[#8b7263] text-[12px] select-none">
                    •••
                  </span>
                );
              }

              const pageNum = Number(p);
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={`page-${p}`}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  aria-label={`Halaman ${p}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                    isActive
                      ? 'bg-[#964900] text-white shadow-xs scale-102 font-extrabold'
                      : 'bg-[#e9edff] hover:bg-[#dce2f7] text-[#141b2b]'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-[#e9edff] text-[#141b2b] hover:text-[#964900] hover:bg-[#dce2f7] flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              title="Halaman Berikutnya"
              aria-label="Halaman berikutnya"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </nav>
        </div>
      </footer>

      {/* Brand Bottom Footer */}
      <footer aria-label="Informasi Hak Cipta Perusahaan" className="w-full bg-[#f1f3ff] border-t border-[#dce2f7] py-6 px-3.5 sm:px-6">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left text-[#574235] text-[12px] sm:text-[12.5px]">
          <div>
            © 2025 <strong className="font-bold text-[#141b2b]">UD REZ WAN JAYA</strong>. Katalog Galeri Cetak & Desain Undangan Pernikahan Eksklusif.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] text-[#574235]">
            <span>Percetakan & Desain Grafis Profesional</span>
            <span className="hidden sm:inline">•</span>
            <span>Offset & Digital Printing</span>
          </div>
        </div>
      </footer>
    </>
  );
};
