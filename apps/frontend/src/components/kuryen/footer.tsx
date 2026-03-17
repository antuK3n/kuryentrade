import { Facebook, Instagram, Github } from "lucide-react"

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="py-8 px-4 text-center">
      <p className="text-lg font-semibold text-primary italic mb-4">
        Polytechnic University of the Philippines, Manila
      </p>
      <div className="flex justify-center gap-6 mb-4">
        <a href="#" className="text-primary hover:text-primary/80 transition-colors">
          <Facebook className="w-6 h-6" />
        </a>
        <a href="#" className="text-primary hover:text-primary/80 transition-colors">
          <Instagram className="w-6 h-6" />
        </a>
        <a href="#" className="text-primary hover:text-primary/80 transition-colors">
          <XIcon className="w-6 h-6" />
        </a>
        <a href="#" className="text-primary hover:text-primary/80 transition-colors">
          <Github className="w-6 h-6" />
        </a>
      </div>
      <p className="text-sm text-muted-foreground">
        © 2026 KuryenTrade • Energy Trading Platform
      </p>
    </footer>
  )
}
