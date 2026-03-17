"use client"

import { Logo } from "./logo"
import { Footer } from "./footer"

interface AuthLayoutProps {
  children: React.ReactNode
  heroTitle: string
  heroSubtitle: string
  heroFeatures?: string[]
  ctaLabel: string
  ctaAction?: () => void
}

export function AuthLayout({
  children,
  heroTitle,
  heroSubtitle,
  heroFeatures,
  ctaLabel,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/80" />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 p-4 md:p-6">
        <Logo />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/5">
            <div className="grid md:grid-cols-2">
              {/* Form Side */}
              <div className="p-6 md:p-8">
                {children}
              </div>

              {/* Hero Side */}
              <div className="relative hidden md:block">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-transparent to-transparent" />
                <div className="relative h-full p-8 flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-2 text-pretty">
                      {heroTitle}
                    </h2>
                    <p className="text-card-foreground/80 mb-6">
                      {heroSubtitle}
                    </p>
                    {heroFeatures && heroFeatures.length > 0 && (
                      <ul className="space-y-2">
                        {heroFeatures.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-card-foreground/80">
                            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                      <span className="w-8 h-1 bg-card-foreground rounded-full" />
                      <span className="w-2 h-1 bg-card-foreground/50 rounded-full" />
                      <span className="w-2 h-1 bg-card-foreground/50 rounded-full" />
                    </div>
                    <button className="ml-auto px-6 py-2 bg-card-foreground text-background rounded-lg font-medium hover:bg-card-foreground/90 transition-colors">
                      {ctaLabel}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
