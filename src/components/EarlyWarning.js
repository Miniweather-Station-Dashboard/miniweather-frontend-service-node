import React, { useState } from "react";
import { Alert } from "./Atom";
import { useSelector } from "react-redux";
import useWarningData from "../redux/hooks/fetchWarningData";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const EarlyWarning = () => {
  const { warnings, loading, error, total, totalPages } = useSelector((s) => s.warning);

  // Local UI state; drives the hook (server-side pagination)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Fetch when page/limit change
  useWarningData({ page, limit: pageSize });

  // Use the server-paged data directly
  const pagedWarnings = warnings || [];

  // Derive counts safely (fallback to client length if backend doesn't send total)
  const safeTotal = typeof total === "number" ? total : pagedWarnings.length;
  const safeTotalPages =
    (typeof totalPages === "number" && totalPages > 0)
      ? totalPages
      : Math.max(1, Math.ceil(safeTotal / pageSize));

  // Clamp page when totalPages changes
  const gotoPage = (p) => setPage(Math.min(Math.max(1, p), safeTotalPages));

  const startItem = safeTotal === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, safeTotal);

  if (loading === "pending") {
    return (
      <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-2">Peringatan Dini</h3>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="lg:col-span-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (safeTotal === 0) {
    return (
      <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-2">Peringatan Dini</h3>
        <p className="text-sm text-gray-500 mb-4">Peringatan ini penting</p>
        <p className="text-gray-500 text-sm italic">
          Tidak ada peringatan dini aktif saat ini.
        </p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <h3 className="text-lg font-semibold">Peringatan Dini</h3>
          <p className="text-sm text-gray-500">Status bencana terkini</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-600">
            Tampilkan
          </label>
          <select
            id="pageSize"
            className="border rounded-md px-2 py-1 text-sm"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}/halaman
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {pagedWarnings.map((warning) => (
          <Alert
            key={warning.id}
            type={warning.type}
            title={warning.type.charAt(0).toUpperCase() + warning.type.slice(1)}
            lastUpdated={warning.updatedAt}
          >
            {warning.message}
          </Alert>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-600">
          Menampilkan <span className="font-medium">{startItem}</span>–
          <span className="font-medium">{endItem}</span> dari{" "}
          <span className="font-medium">{safeTotal}</span>
        </p>

        <nav className="flex items-center gap-1" aria-label="Pagination">
          <button
            type="button"
            onClick={() => gotoPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
          >
            ‹ Prev
          </button>

          {Array.from({ length: safeTotalPages }).map((_, i) => {
            const p = i + 1;
            const isEdge = p === 1 || p === safeTotalPages;
            const isNear = Math.abs(p - page) <= 1;
            if (safeTotalPages <= 7 || isEdge || isNear || (page <= 3 && p <= 5) || (page >= safeTotalPages - 2 && p >= safeTotalPages - 4)) {
              return (
                <button
                  key={p}
                  onClick={() => gotoPage(p)}
                  className={`px-3 py-1 rounded-md border text-sm ${
                    p === page ? "bg-gray-900 text-white" : "bg-white"
                  }`}
                >
                  {p}
                </button>
              );
            }
            if (p === 2 && page > 4) return <span key="left-ellipsis" className="px-2 text-gray-500">…</span>;
            if (p === safeTotalPages - 1 && page < safeTotalPages - 3) return <span key="right-ellipsis" className="px-2 text-gray-500">…</span>;
            return null;
          })}

          <button
            type="button"
            onClick={() => gotoPage(page + 1)}
            disabled={page === safeTotalPages}
            className="px-3 py-1 rounded-md border text-sm disabled:opacity-50"
          >
            Next ›
          </button>
        </nav>
      </div>
    </div>
  );
};

export default EarlyWarning;
