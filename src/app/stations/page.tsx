import tideData from "@/data/tides.json";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Tide Stations",
  description: "Browse all 37 Australian tide prediction stations by state.",
};

export default function StationsPage() {
  const states = [...new Set(tideData.stations.map(s => s.state))];
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-8">All Tide Stations</h1>
      {states.map(state => (
        <div key={state} className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Link href={`/state/${state.toLowerCase()}`} className="link link-hover">{state}</Link>
            <span className="badge badge-sm">{tideData.stations.filter(s => s.state === state).length}</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {tideData.stations.filter(s => s.state === state).map(s => (
              <Link key={s.id} href={`/station/${s.slug}`} className="btn btn-sm btn-outline">{s.name}</Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
