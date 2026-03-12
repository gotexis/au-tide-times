import tideData from "@/data/tides.json";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return tideData.stations.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const station = tideData.stations.find(s => s.slug === slug);
  if (!station) return {};
  return {
    title: `${station.name} Tide Times - 7 Day Forecast`,
    description: `Free tide predictions for ${station.name}, ${station.state}. High and low tide times, heights, moon phase, and solunar fishing calendar.`,
    openGraph: {
      title: `${station.name} Tide Times`,
      description: `7-day tide forecast for ${station.name}, ${station.state}`,
    },
  };
}

function getMoonEmoji(name: string) {
  const map: Record<string, string> = {
    "New Moon": "🌑", "Waxing Crescent": "🌒", "First Quarter": "🌓",
    "Waxing Gibbous": "🌔", "Full Moon": "🌕", "Waning Gibbous": "🌖",
    "Last Quarter": "🌗", "Waning Crescent": "🌘",
  };
  return map[name] || "🌙";
}

export default async function StationPage({ params }: Props) {
  const { slug } = await params;
  const station = tideData.stations.find(s => s.slug === slug);
  if (!station) notFound();

  // Group tides by date
  const tidesByDate: Record<string, typeof station.tides> = {};
  for (const tide of station.tides) {
    const date = tide.time.split("T")[0];
    if (!tidesByDate[date]) tidesByDate[date] = [];
    tidesByDate[date].push(tide);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": station.name,
    "geo": { "@type": "GeoCoordinates", "latitude": station.lat, "longitude": station.lon },
    "address": { "@type": "PostalAddress", "addressRegion": station.state, "addressCountry": "AU" },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={jsonLd} />
      {/* Breadcrumbs */}
      <div className="text-sm breadcrumbs mb-4">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href={`/state/${station.state.toLowerCase()}`}>{station.state}</Link></li>
          <li>{station.name}</li>
        </ul>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold">{station.name}</h1>
          <p className="text-base-content/60 mt-1">
            {station.state} · {station.lat.toFixed(4)}°S, {station.lon.toFixed(4)}°E
          </p>
        </div>
        <div className="flex items-center gap-3 bg-base-200 rounded-xl px-5 py-3 border border-base-300">
          <span className="text-3xl">{getMoonEmoji(station.solunar.moon_phase_name)}</span>
          <div>
            <div className="font-bold text-sm">{station.solunar.moon_phase_name}</div>
            <div className="text-xs text-base-content/50">
              Fishing: {"★".repeat(station.solunar.fishing_rating)}{"☆".repeat(5 - station.solunar.fishing_rating)}
            </div>
          </div>
        </div>
      </div>

      {/* Tide table */}
      <div className="space-y-6">
        {Object.entries(tidesByDate).map(([date, tides]) => {
          const d = new Date(date + "T00:00:00");
          const dayName = d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "short" });
          const isToday = date === new Date().toISOString().slice(0, 10);

          return (
            <div key={date} className={`card bg-base-200 border ${isToday ? "border-primary" : "border-base-300"}`}>
              <div className="card-body p-4">
                <h2 className="font-bold flex items-center gap-2">
                  {isToday && <span className="badge badge-primary badge-sm">Today</span>}
                  {dayName}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {tides.map((tide, i) => (
                    <div key={i} className={`rounded-lg p-3 text-center ${
                      tide.type === "high" ? "bg-info/10 border border-info/20" : "bg-success/10 border border-success/20"
                    }`}>
                      <div className={`font-bold text-xs ${tide.type === "high" ? "text-info" : "text-success"}`}>
                        {tide.type === "high" ? "▲ HIGH" : "▼ LOW"}
                      </div>
                      <div className="text-lg font-mono font-bold mt-1">{tide.time.split("T")[1]}</div>
                      <div className="text-sm text-base-content/60">{tide.height}m</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nearby stations */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Other {station.state} Stations</h2>
        <div className="flex flex-wrap gap-2">
          {tideData.stations
            .filter(s => s.state === station.state && s.id !== station.id)
            .map(s => (
              <Link key={s.id} href={`/station/${s.slug}`} className="btn btn-sm btn-outline">
                {s.name}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
