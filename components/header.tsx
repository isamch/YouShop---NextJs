'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, LogOut, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';

export function Header() {
  const { getItemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">Y</span>
            </div>
            <span className="hidden sm:inline font-bold text-lg text-foreground">YouShop</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-md bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-6 mr-4">
              <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Shop
              </Link>
              {isAuthenticated && (
                <Link href="/orders" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  My Orders
                </Link>
              )}
            </nav>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground">Hello, {user?.name?.split(' ')[0]}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
              </>
            )}
            <Link href="/cart">
              <Button variant="default" size="sm" className="relative flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Cart
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-md transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <div className="mb-4 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-muted text-foreground placeholder:text-muted-foreground text-sm"
                />
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              <Link href="/products">
                <Button variant="ghost" className="w-full justify-start">
                  Products
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" className="w-full justify-start relative">
                  Shopping Cart
                  {itemCount > 0 && (
                    <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" className="w-full justify-start">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
