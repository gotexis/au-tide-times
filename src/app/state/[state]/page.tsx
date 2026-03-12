import tideData from "@/data/tides.json";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

const STATE_NAMES: Record<string, string> = {
  nsw: "New South Wales", vic: "Victoria", qld: "Queensland",
  wa: "Western Australia", sa: "South Australia", tas: "Tasmania", nt: "Northern Territory",
};

type Props = { params: Promise<{ state: string }> };

export function generateStaticParams() {
  return Object.keys(STATE_NAMES).map(state => ({ state }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const name = STATE_NAMES[state];
  if (!name) return {};
  return {
    title: `${name} Tide Times - All Stations`,
    description: `Tide predictions for all ${name} coastal stations. Free 7-day tide forecasts and fishing calendar.`,
  };
}

export default async function StatePage({ params }: Props) {
  const { state } = await params;
  const stateName = STATE_NAMES[state];
  if (!stateName) notFound();

  const stateCode = state.toUpperCase();
  const stations = tideData.stations.filter(s => s.state === stateCode);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm breadcrumbs mb-4">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li>{stateName}</li>
        </ul>
      </div>

      <h1 className="text-3xl font-extrabold mb-2">{stateName} Tide Stations</h1>
      <p className="text-base-content/60 mb-8">{stations.length} tide prediction stations</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map(station => {
          const nextHigh = station.tides.find(t => t.type === "high");
          const nextLow = station.tides.find(t => t.type === "low");
          return (
            <Link key={station.id} href={`/station/${station.slug}`}
              className="card bg-base-200 hover:bg-base-300 transition-colors border border-base-300">
              <div className="card-body p-4">
                <h2 className="card-title text-base">{station.name}</h2>
                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  {nextHigh && (
                    <div className="bg-info/10 rounded p-2">
                      <span className="text-info font-bold">▲ HIGH</span>
                      <div>{nextHigh.time.split("T")[1]} · {nextHigh.height}m</div>
                    </div>
                  )}
                  {nextLow && (
                    <div className="bg-success/10 rounded p-2">
                      <span className="text-success font-bold">▼ LOW</span>
                      <div>{nextLow.time.split("T")[1]} · {nextLow.height}m</div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
