import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './button';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Programs', href: '/get-involved' },
    { name: 'Team', href: '/team' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => location.pathname === href;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled 
        ? "bg-white/95 backdrop-blur-xl border-b border-border shadow-lg" 
        : "bg-white/90 backdrop-blur-md"
    )}>
      <div className="professional-container">
        <div className="flex justify-between items-center h-20 lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-xl lg:text-2xl">I</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  Impact Initiative Nepal
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground font-medium">
                  Empowering Women Entrepreneurs
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "relative text-sm font-semibold transition-all duration-300 py-2 px-1 hover:text-primary",
                  isActive(item.href) 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="default" className="font-semibold" asChild>
              <Link to="/contact">
                Get Started
              </Link>
            </Button>
            <Button variant="hero" size="default" className="font-semibold shadow-lg hover:shadow-xl" asChild>
              <Link to="/get-involved">
                Join AWE Program
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative"
            >
              <div className="relative w-6 h-6">
                <span className={cn(
                  "absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out",
                  isMenuOpen ? "rotate-45 translate-y-0" : "-translate-y-2"
                )} />
                <span className={cn(
                  "absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out",
                  isMenuOpen ? "opacity-0" : "opacity-100"
                )} />
                <span className={cn(
                  "absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out",
                  isMenuOpen ? "-rotate-45 translate-y-0" : "translate-y-2"
                )} />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-8 border-t border-border bg-white/95 backdrop-blur-xl animate-fade-in">
            <div className="flex flex-col space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-4 py-3 text-base font-semibold transition-all duration-300 rounded-lg",
                    isActive(item.href) 
                      ? "text-primary bg-primary/5 border-l-4 border-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-6 space-y-4">
                <Button variant="outline" size="lg" className="w-full font-semibold" asChild>
                  <Link to="/contact">Get Started</Link>
                </Button>
                <Button variant="hero" size="lg" className="w-full font-semibold" asChild>
                  <Link to="/get-involved">Join AWE Program</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;