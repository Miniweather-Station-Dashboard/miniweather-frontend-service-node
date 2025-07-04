import React, { useEffect } from "react";
import { Alert } from "./Atom";
import { useSelector } from "react-redux";

const EarlyWarning = () => {
  const { warnings, loading, error } = useSelector((state) => state.warning);

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


  if (warnings.length === 0) {
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
      <h3 className="text-lg font-semibold mb-2">Peringatan Dini</h3>
      <p className="text-sm text-gray-500 mb-4">Status bencana terkini</p>
      <div className="space-y-3">
        {warnings.map((warning) => (
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
    </div>
  );
};

export default EarlyWarning;
