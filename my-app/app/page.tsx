import { Metadata } from "next";
import { Header } from "@/components/header";
import { IdeaForm } from "@/components/idea-form";
import { IdeasServerWrapper } from "@/components/ideas-server-wrapper";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PreviewSection } from "@/components/preview-section";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Website Idea Generator | AI-Powered Website Section Creator",
  description:
    "Transform your website ideas into professional sections with our AI-powered generator. Create stunning landing pages, business sites, and more with intelligent section generation.",
  keywords: [
    "website generator",
    "AI website builder",
    "landing page creator",
    "website sections",
    "web development tool",
    "business website",
    "website ideas",
    "HTML generator",
  ],
  authors: [{ name: "Website Idea Generator Team" }],
  creator: "Website Idea Generator",
  publisher: "Website Idea Generator",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "http://localhost:3000",
    title: "Website Idea Generator | AI-Powered Website Section Creator",
    description:
      "Transform your website ideas into professional sections with our AI-powered generator.",
    siteName: "Website Idea Generator",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Website Idea Generator - AI-Powered Website Section Creator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Idea Generator | AI-Powered Website Section Creator",
    description:
      "Transform your website ideas into professional sections with our AI-powered generator.",
    images: ["/og-image.jpg"],
  },

  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 space-y-8">
        <Header />
        {/* <WebsiteGenerator /> */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Input Form and Ideas List */}
          <div className="lg:col-span-1">
            <IdeaForm />

            <Suspense fallback={<Skeleton className="h-80" />}>
              <IdeasServerWrapper />
            </Suspense>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-2">
            <PreviewSection />
          </div>
        </div>
      </div>
    </main>
  );
}
