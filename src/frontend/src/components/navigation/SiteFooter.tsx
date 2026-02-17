import { Link } from '@tanstack/react-router';
import { SiInstagram, SiFacebook, SiX } from 'react-icons/si';
import { getOrderedLocations } from '../../utils/locations';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'sajavathub'
  );
  const locations = getOrderedLocations();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <img
              src="/assets/generated/sajavathub-wordmark.dim_600x200.png"
              alt="SajavatHub"
              className="h-8"
            />
            <p className="text-sm text-muted-foreground">
              Transforming Indian homes with personalized interior design services.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Instagram"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Facebook"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="X (Twitter)"
              >
                <SiX className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/packages" className="text-muted-foreground transition-colors hover:text-foreground">
                  Design Packages
                </Link>
              </li>
              <li>
                <Link to="/designers" className="text-muted-foreground transition-colors hover:text-foreground">
                  Our Designers
                </Link>
              </li>
              <li>
                <Link to="/visualizer" className="text-muted-foreground transition-colors hover:text-foreground">
                  AI Room Visualizer
                </Link>
              </li>
              <li>
                <Link to="/vendors" className="text-muted-foreground transition-colors hover:text-foreground">
                  Vendors
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground transition-colors hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Locations</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {locations.map((location) => (
                <li key={location}>{location}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} SajavatHub. All rights reserved. Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
