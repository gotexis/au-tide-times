import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "AU Tide Times & Fishing Calendar",
    template: "%s | AU Tide Times",
  },
  description: "Free Australian tide predictions and solunar fishing calendar. 37 tide stations across all states with 7-day forecasts, moon phases, and fishing ratings.",
  openGraph: {
    title: "AU Tide Times & Fishing Calendar",
    description: "Free tide predictions and fishing calendar for 37 Australian locations.",
    url: "https://tides.rollersoft.com.au",
    siteName: "AU Tide Times",
    locale: "en_AU",
    type: "website",
  },
  alternates: {
    canonical: "https://tides.rollersoft.com.au",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="night">
      <body className="min-h-screen bg-base-100 flex flex-col">
        <header className="navbar bg-base-200/80 backdrop-blur-sm border-b border-base-300 sticky top-0 z-50">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <span className="text-2xl">🌊</span>
              <span>AU Tide Times</span>
            </Link>
            <nav className="hidden md:flex gap-4 text-sm">
              <Link href="/" className="link link-hover">Home</Link>
              <Link href="/stations" className="link link-hover">All Stations</Link>
              <Link href="/map" className="link link-hover">Map</Link>
              <Link href="/fishing" className="link link-hover">Fishing Calendar</Link>
            </nav>
            <div className="dropdown dropdown-end md:hidden">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </div>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52 mt-2">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/stations">All Stations</Link></li>
                <li><Link href="/map">Map</Link></li>
                <li><Link href="/fishing">Fishing Calendar</Link></li>
              </ul>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-base-200 border-t border-base-300">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-base-content/60">
              <div>
                <h3 className="font-bold text-base-content mb-2">AU Tide Times</h3>
                <p>Free tide predictions and fishing calendar for Australian coastal locations. Data derived from BOM harmonic constants.</p>
              </div>
              <div>
                <h3 className="font-bold text-base-content mb-2">States</h3>
                <div className="flex flex-wrap gap-2">
                  {["NSW","VIC","QLD","WA","SA","TAS","NT"].map(s => (
                    <Link key={s} href={`/state/${s.toLowerCase()}`} className="link link-hover">{s}</Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-base-content mb-2">About</h3>
                <p>Tide predictions are approximations. Always check official BOM data for navigation. For recreational reference only.</p>
              </div>
            </div>
            <div className="divider my-4"></div>
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-base-content/40">
              <p>© {new Date().getFullYear()} AU Tide Times. A <a href="https://rollersoft.com.au" className="link link-hover">Rollersoft</a> project.</p>
              <p>Data sourced from BOM (public domain)</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
