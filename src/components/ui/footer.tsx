import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { Input } from './input';
import { Mail, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Section */}
        <div className="bg-primary-glow/20 rounded-lg p-6 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-xl font-bold mb-2">
              Stay Connected with Our Impact
            </h3>
            <p className="text-primary-foreground/80 mb-4">
              Get updates on upcoming events, success stories, and opportunities to make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="bg-card text-foreground border-border"
              />
              <Button variant="cta" size="default">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-lg font-bold mb-4">
              Impact Initiative Nepal
            </h3>
            <p className="text-primary-foreground/80 mb-4 max-w-md">
              Purpose-driven non-profit organization committed to unlocking Nepal's economic potential 
              through women entrepreneurship and local business empowerment.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Heart className="h-4 w-4 text-accent" />
              <span>Empowering communities, one entrepreneur at a time</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  About IIN
                </Link>
              </li>
              <li>
                <Link to="/get-involved" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  AWE Bootcamp
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 text-accent" />
                <div>
                  <a 
                    href="mailto:info@impactinitiativenepal.com" 
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth"
                  >
                    info@impactinitiativenepal.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-accent" />
                <div className="text-primary-foreground/80">
                  Kathmandu, Nepal
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm text-primary-foreground/60">
          <p>&copy; 2024 Impact Initiative Nepal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;