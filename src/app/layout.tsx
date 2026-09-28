import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { ThemeProvider } from "@/components/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ahmed Hamada | Data Analyst & BI Developer",
  description:
    "Official portfolio of Ahmed Hamada - Data Analyst, BI Developer, and Technical Instructor specializing in Power BI, SQL, Python, Excel, and executive dashboard engineering.",
  keywords: [
    "Ahmed Hamada",
    "Data Analyst",
    "BI Developer",
    "Power BI",
    "SQL",
    "Python",
    "DAX",
    "Excel",
    "Business Intelligence",
    "Dashboard Developer",
  ],
  authors: [{ name: "Ahmed Hamada" }],
  creator: "Ahmed Hamada",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    url: "https://ahmedhamada.dev",
    siteName: "Ahmed Hamada Portfolio",
    title: "Ahmed Hamada | Data Analyst & BI Developer",
    description:
      "Turning raw data into meaningful insights and interactive dashboards that support better business decisions.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${cairo.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
