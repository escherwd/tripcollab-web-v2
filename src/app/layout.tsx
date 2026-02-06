import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, DM_Sans, Inter, Platypi } from "next/font/google";
import "@/styles/app.css";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import { Analytics } from "@vercel/analytics/next";
import Providers from "./providers";

const platypi = Platypi({
  variable: "--font-platypi",
  subsets: ['latin'],
  weight: 'variable'
})

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Inter font used for some unicode characters not well supported by Plex Sans
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s – tripcollab",
    default: "tripcollab"
  },
  description: "Online Collaborative Travel Planner",
  icons: "/tripcollab-logo.svg"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plexSans.variable} ${plexMono.variable} ${dmSans.variable} ${inter.variable} ${platypi.variable} w-screen min-h-screen`}
      >
        <AuthKitProvider>
          <Providers>{children}</Providers>
        </AuthKitProvider>
        <Analytics />
      </body>
    </html>
  );
}
