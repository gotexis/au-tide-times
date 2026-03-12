"use client";
import dynamic from "next/dynamic";
import tideData from "@/data/tides.json";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function MapPage() {
  const markers = tideData.stations.map(s => ({
    lat: s.lat,
    lng: s.lon,
    label: s.name,
    popup: `${s.state} · Fishing: ${"★".repeat(s.solunar.fishing_rating)}${"☆".repeat(5-s.solunar.fishing_rating)}`,
    href: `/station/${s.slug}`,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-4">🗺️ Tide Station Map</h1>
      <p className="text-base-content/60 mb-6">All {tideData.stations.length} tide stations across Australia. Click a marker for details.</p>
      <div className="rounded-xl overflow-hidden border border-base-300" style={{ height: "70vh" }}>
        <MapView markers={markers} center={[-25.5, 134]} zoom={4} />
      </div>
    </div>
  );
}
