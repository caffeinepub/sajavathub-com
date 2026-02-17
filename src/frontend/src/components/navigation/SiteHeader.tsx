import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { useCartStore } from '../../state/cartStore';
import { useQueryClient } from '@tanstack/react-query';

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    { to: '/packages', label: 'Packages' },
    { to: '/designers', label: 'Designers' },
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
          {/* Shop by Category Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium text-foreground/80 hover:text-foreground">
                Shop by Category
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/products/furniture" className="cursor-pointer">
                  Furniture
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/products/decor" className="cursor-pointer">
                  Decor
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/products/furnishing" className="cursor-pointer">
                  Furnishing
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
        </nav>

        {/* Desktop Auth & Cart */}
        <div className="hidden items-center space-x-4 md:flex">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link>
          </Button>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium">
                  {userProfile?.name || 'Account'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLogin} disabled={isLoggingIn} className="font-medium">
              {isLoggingIn ? 'Signing In...' : 'Sign In'}
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs"
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
              <nav className="flex flex-col space-y-4 pt-8">
                {/* Shop by Category Section in Mobile */}
                <div className="border-b border-border pb-4">
                  <p className="mb-2 text-sm font-semibold text-muted-foreground">Shop by Category</p>
                  <Link
                    to="/products/furniture"
                    className="block py-2 text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Furniture
                  </Link>
                  <Link
                    to="/products/decor"
                    className="block py-2 text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Decor
                  </Link>
                  <Link
                    to="/products/furnishing"
                    className="block py-2 text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Furnishing
                  </Link>
                </div>

                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                    activeProps={{ className: 'text-foreground' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="border-t border-border pt-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="block py-2 text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="mt-4 w-full"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        handleLogin();
                        setMobileMenuOpen(false);
                      }}
                      disabled={isLoggingIn}
                      className="w-full"
                    >
                      {isLoggingIn ? 'Signing In...' : 'Sign In'}
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
