import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Cursor } from "@/components/cursor";
import { IntroProvider } from "@/components/intro-provider";
import { Nav } from "@/components/nav";
import { NetworkMesh } from "@/components/ui/network-mesh";
import { ScrollProgress } from "@/components/scroll-progress";
import { site } from "@/content/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* The display face — every heading on the site uses this. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const title = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  keywords: [
    site.name,
    site.role,
    "software engineer portfolio",
    "web developer",
    ...site.disciplines,
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title,
    description: site.tagline,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col bg-bg text-fg">
        <NetworkMesh />

        <IntroProvider>
          <ScrollProgress />
          <Cursor />
          <Nav />
          <main className="flex-1">{children}</main>
        </IntroProvider>
      </body>
    </html>
  );
}
