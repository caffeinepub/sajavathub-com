import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { useCartStore } from '../../state/cartStore';
import { useQueryClient } from '@tanstack/react-query';

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [designersDropdownOpen, setDesignersDropdownOpen] = useState(false);
  const { identity, clear, login, isLoggingIn } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const cartItemCount = useCartStore((state) => state.getItemCount());

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const navLinks = [
    { to: '/shop', label: 'Shop' },
    { to: '/gift', label: 'Gift Cards' },
    { to: '/visualizer', label: 'AI Room Visualizer' },
    { to: '/vendors', label: 'Vendors' },
    { to: '/faq', label: 'FAQ' },
    { to: '/how-it-works', label: 'How It Works' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/assets/generated/sajavathub-mark.dim_512x512.png"
            alt="SajavatHub"
            className="h-8 w-8"
          />
          <img
            src="/assets/generated/sajavathub-wordmark.dim_600x200.png"
            alt="SajavatHub"
            className="hidden h-6 sm:block"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: 'text-foreground' }}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Designers and Design Packages Dropdown */}
          <DropdownMenu open={designersDropdownOpen} onOpenChange={setDesignersDropdownOpen}>
            <DropdownMenuTrigger className="flex items-center text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus:outline-none">
              Designers and Design Packages <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link
                  to="/designers"
                  className="w-full cursor-pointer"
                  onClick={() => setDesignersDropdownOpen(false)}
                >
                  Designers
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/packages"
                  className="w-full cursor-pointer"
                  onClick={() => setDesignersDropdownOpen(false)}
                >
                  Design Packages
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Desktop Auth & Cart */}
        <div className="hidden items-center space-x-4 md:flex">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  {userProfile?.name || 'Account'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link
                  to="/dashboard"
                  className="block w-full px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Dashboard
                </Link>
                <div className="h-px bg-border my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm"
                >
                  Logout
                </button>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLogin} disabled={isLoggingIn}>
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center space-x-2 md:hidden">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link>
          </Button>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile Designers and Design Packages Section */}
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-muted-foreground mb-3">
                    Designers and Design Packages
                  </p>
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/designers"
                      className="text-base font-medium text-foreground/80 transition-colors hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Designers
                    </Link>
                    <Link
                      to="/packages"
                      className="text-base font-medium text-foreground/80 transition-colors hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Design Packages
                    </Link>
                  </div>
                </div>

                <div className="border-t pt-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="block text-lg font-medium text-foreground/80 transition-colors hover:text-foreground mb-3"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => {
                        handleLogin();
                        setMobileMenuOpen(false);
                      }}
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? 'Logging in...' : 'Login'}
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
