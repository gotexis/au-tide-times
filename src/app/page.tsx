import tideData from "@/data/tides.json";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

function getMoonEmoji(name: string) {
  const map: Record<string, string> = {
    "New Moon": "🌑", "Waxing Crescent": "🌒", "First Quarter": "🌓",
    "Waxing Gibbous": "🌔", "Full Moon": "🌕", "Waning Gibbous": "🌖",
    "Last Quarter": "🌗", "Waning Crescent": "🌘",
  };
  return map[name] || "🌙";
}

function FishingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= rating ? "text-warning" : "text-base-content/20"}>★</span>
      ))}
    </div>
  );
}

type Station = (typeof tideData.stations)[number];

function getNextTides(station: Station) {
  const now = new Date().toISOString().slice(0, 16);
  return station.tides.filter(t => t.time >= now).slice(0, 4);
}

function StationCard({ station }: { station: Station }) {
  const nextTides = getNextTides(station);
  const nextHigh = nextTides.find(t => t.type === "high");
  const nextLow = nextTides.find(t => t.type === "low");

  return (
    <Link href={`/station/${station.slug}`} className="card bg-base-200 hover:bg-base-300 transition-colors border border-base-300">
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="card-title text-sm">{station.name}</h3>
            <span className="badge badge-outline badge-sm mt-1">{station.state}</span>
          </div>
          <FishingStars rating={station.solunar.fishing_rating} />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          {nextHigh && (
            <div className="bg-info/10 rounded-lg p-2">
              <div className="text-info font-bold">▲ HIGH</div>
              <div>{nextHigh.time.split("T")[1]}</div>
              <div className="font-mono">{nextHigh.height}m</div>
            </div>
          )}
          {nextLow && (
            <div className="bg-success/10 rounded-lg p-2">
              <div className="text-success font-bold">▼ LOW</div>
              <div>{nextLow.time.split("T")[1]}</div>
              <div className="font-mono">{nextLow.height}m</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const states = [...new Set(tideData.stations.map(s => s.state))];
  const moonPhase = tideData.stations[0]?.solunar;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AU Tide Times & Fishing Calendar",
    "description": "Free Australian tide predictions and solunar fishing calendar for 37 coastal locations.",
    "url": "https://tides.rollersoft.com.au",
    "applicationCategory": "Weather",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "AUD" },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="space-y-8">
        {/* Hero */}
        <section className="bg-gradient-to-br from-base-200 via-base-100 to-primary/5 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              🌊 Australian Tide Times
            </h1>
            <p className="text-lg text-base-content/60 max-w-2xl mx-auto mb-6">
              Free 7-day tide predictions and solunar fishing calendar for {tideData.stations.length} locations across Australia
            </p>
            {/* Moon phase banner */}
            {moonPhase && (
              <div className="inline-flex items-center gap-3 bg-base-200 rounded-full px-6 py-3 border border-base-300">
                <span className="text-3xl">{getMoonEmoji(moonPhase.moon_phase_name)}</span>
                <div className="text-left">
                  <div className="font-bold text-sm">{moonPhase.moon_phase_name}</div>
                  <div className="text-xs text-base-content/50">
                    Fishing: <FishingStars rating={moonPhase.fishing_rating} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Stats */}
        <div className="container mx-auto px-4">
          <div className="stats stats-vertical md:stats-horizontal shadow w-full bg-base-200 border border-base-300">
            <div className="stat">
              <div className="stat-title">Tide Stations</div>
              <div className="stat-value text-primary">{tideData.stations.length}</div>
              <div className="stat-desc">Across all states</div>
            </div>
            <div className="stat">
              <div className="stat-title">States Covered</div>
              <div className="stat-value text-secondary">{states.length}</div>
              <div className="stat-desc">NSW, VIC, QLD, WA, SA, TAS, NT</div>
            </div>
            <div className="stat">
              <div className="stat-title">Forecast</div>
              <div className="stat-value text-accent">7 Days</div>
              <div className="stat-desc">Updated regularly</div>
            </div>
          </div>
        </div>

        {/* Stations by state */}
        <div className="container mx-auto px-4 space-y-8 pb-12">
          {states.map(state => {
            const stateStations = tideData.stations.filter(s => s.state === state);
            return (
              <section key={state}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{state}</h2>
                  <Link href={`/state/${state.toLowerCase()}`} className="btn btn-ghost btn-sm">
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {stateStations.map(station => (
                    <StationCard key={station.id} station={station} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
