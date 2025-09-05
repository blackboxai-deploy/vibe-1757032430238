import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Video Generator",
  description: "Generate stunning AI videos from text prompts using advanced AI technology",
  keywords: ["AI", "video generation", "artificial intelligence", "text to video", "content creation"],
  authors: [{ name: "AI Video Generator" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
  openGraph: {
    title: "AI Video Generator",
    description: "Generate stunning AI videos from text prompts using advanced AI technology",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Video Generator",
    description: "Generate stunning AI videos from text prompts using advanced AI technology",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-gray-50 to-gray-100`}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">AI Video Generator</h1>
                    <p className="text-xs text-gray-500">Powered by Advanced AI</p>
                  </div>
                </div>
                
                <nav className="hidden md:flex items-center gap-6">
                  <div className="text-sm text-gray-600">
                    Transform text into stunning videos with AI
                  </div>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white/50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  © 2024 AI Video Generator. Create amazing videos with AI technology.
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Built with Next.js & AI</span>
                  <span>•</span>
                  <span>Fast & Secure</span>
                  <span>•</span>
                  <span>High Quality Output</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}