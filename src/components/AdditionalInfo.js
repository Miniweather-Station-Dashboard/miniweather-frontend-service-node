"use client";

import { Badge } from "@/components/Atom";

const AdditionalInfo = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">Kualitas Udara</span>
      <Badge>Baik</Badge>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">Indeks UV</span>
      <Badge variant="outline">Sedang</Badge>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">Visibilitas</span>
      <span className="text-sm">10 km</span>
    </div>
  </div>
);

export default AdditionalInfo;
