import tideData from "@/data/tides.json";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solunar Fishing Calendar",
  description: "Best fishing times based on moon phase and solunar theory. Check fishing ratings for all Australian tide stations.",
};

function getMoonEmoji(name: string) {
  const map: Record<string, string> = {
    "New Moon": "🌑", "Waxing Crescent": "🌒", "First Quarter": "🌓",
    "Waxing Gibbous": "🌔", "Full Moon": "🌕", "Waning Gibbous": "🌖",
    "Last Quarter": "🌗", "Waning Crescent": "🌘",
  };
  return map[name] || "🌙";
}

export default function FishingPage() {
  const moon = tideData.stations[0]?.solunar;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-4">🎣 Solunar Fishing Calendar</h1>

      {/* Moon phase card */}
      {moon && (
        <div className="card bg-base-200 border border-base-300 mb-8 max-w-md">
          <div className="card-body items-center text-center">
            <span className="text-6xl">{getMoonEmoji(moon.moon_phase_name)}</span>
            <h2 className="card-title">{moon.moon_phase_name}</h2>
            <p className="text-base-content/60">Moon illumination: {Math.round(Math.abs(moon.moon_phase - 0.5) * 200)}%</p>
            <div className="text-2xl text-warning">
              {"★".repeat(moon.fishing_rating)}{"☆".repeat(5 - moon.fishing_rating)}
            </div>
            <p className="text-sm text-base-content/50">
              {moon.fishing_rating >= 4 ? "Excellent fishing conditions!" :
               moon.fishing_rating >= 3 ? "Good fishing conditions." :
               moon.fishing_rating >= 2 ? "Fair fishing conditions." :
               "Poor fishing — consider waiting for better moon phase."}
            </p>
          </div>
        </div>
      )}

      {/* Guide */}
      <div className="prose prose-invert max-w-none">
        <h2>How Solunar Theory Works</h2>
        <p>
          The <strong>solunar theory</strong> predicts that fish (and wildlife) are most active during certain phases
          of the moon. The best fishing times occur during:
        </p>
        <ul>
          <li><strong>New Moon</strong> 🌑 — Peak activity, excellent fishing</li>
          <li><strong>Full Moon</strong> 🌕 — Peak activity, excellent fishing</li>
          <li><strong>First/Last Quarter</strong> 🌓🌗 — Moderate activity</li>
          <li><strong>Crescent/Gibbous</strong> — Lower activity</li>
        </ul>

        <h2>Major & Minor Feeding Periods</h2>
        <p>
          <strong>Major periods</strong> (~2 hours) occur when the moon is directly overhead or underfoot.
          <strong>Minor periods</strong> (~1 hour) occur during moonrise and moonset.
          Combine these with tide changes for the best results.
        </p>

        <h2>Tips for Australian Fishing</h2>
        <ul>
          <li>Fish the incoming tide — baitfish get pushed into feeding zones</li>
          <li>Dawn and dusk are always productive regardless of moon phase</li>
          <li>Combine solunar periods with tide changes for best results</li>
          <li>Check local regulations and bag limits before fishing</li>
          <li>In tropical waters (QLD, NT, WA), the larger tides during new/full moon create stronger currents</li>
        </ul>
      </div>

      {/* Station ratings */}
      <h2 className="text-xl font-bold mt-8 mb-4">Today&apos;s Fishing Ratings by Station</h2>
      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Station</th>
              <th>State</th>
              <th>Rating</th>
              <th>Moon Phase</th>
            </tr>
          </thead>
          <tbody>
            {tideData.stations.map(s => (
              <tr key={s.id}>
                <td><a href={`/station/${s.slug}`} className="link link-hover">{s.name}</a></td>
                <td><span className="badge badge-outline badge-xs">{s.state}</span></td>
                <td className="text-warning">{"★".repeat(s.solunar.fishing_rating)}{"☆".repeat(5 - s.solunar.fishing_rating)}</td>
                <td>{getMoonEmoji(s.solunar.moon_phase_name)} {s.solunar.moon_phase_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
