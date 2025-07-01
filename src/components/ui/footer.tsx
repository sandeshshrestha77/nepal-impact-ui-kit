import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { Input } from './input';
import { Mail, MapPin, Heart, Award, TrendingUp } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'About IIN', href: '/about' },
    { name: 'Our Programs', href: '/get-involved' },
    { name: 'Success Stories', href: '/about' },
    { name: 'Team', href: '/team' },
    { name: 'Contact', href: '/contact' }
  ];

  const programs = [
    { name: 'AWE Bootcamp', href: '/get-involved' },
    { name: 'Digital Skills Training', href: '/get-involved' },
    { name: 'Rural Entrepreneur Network', href: '/get-involved' },
    { name: 'Mentorship Program', href: '/get-involved' }
  ];

  const resources = [
    { name: 'Business Resources', href: '#' },
    { name: 'Funding Opportunities', href: '#' },
    { name: 'Market Research', href: '#' },
    { name: 'Legal Support', href: '#' },
    { name: 'Success Metrics', href: '#' }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter Section */}
        <div className="bg-primary-glow/15 backdrop-blur rounded-xl p-8 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="font-display text-2xl lg:text-h3 font-bold mb-3">
              Stay Connected with Nepal's Entrepreneurial Journey
            </h3>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Get exclusive updates on upcoming programs, success stories, funding opportunities, 
              and insights from Nepal's growing entrepreneurial ecosystem. Join over 5,000 entrepreneurs 
              and supporters in our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email address"
                className="bg-card text-foreground border-border flex-1"
              />
              <Button variant="cta" size="default" className="hover-lift">
                Subscribe Now
              </Button>
            </div>
            <p className="text-xs text-primary-foreground/60 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* About Section */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-xl font-bold mb-6">
              Impact Initiative Nepal
            </h3>
            <p className="text-primary-foreground/80 mb-6 max-w-md leading-relaxed">
              A purpose-driven non-profit organization committed to unlocking Nepal's economic potential 
              through strategic empowerment of women entrepreneurs and local business communities. 
              Together, we're building a more inclusive and prosperous Nepal.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-sm">Empowering communities, one entrepreneur at a time</span>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-sm">500+ women empowered since 2020</span>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-sm">85% business success rate</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-smooth">
                <span className="text-sm font-bold">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-smooth">
                <span className="text-sm font-bold">in</span>
              </a>
              <a href="#" className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-smooth">
                <span className="text-sm font-bold">ig</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-semibold mb-6">Our Programs</h4>
            <ul className="space-y-3 text-sm">
              {programs.map((program, index) => (
                <li key={index}>
                  <Link 
                    to={program.href} 
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth hover:translate-x-1 inline-block"
                  >
                    {program.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Resources */}
          <div>
            <h4 className="font-semibold mb-6">Get in Touch</h4>
            <div className="space-y-4 text-sm mb-6">
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 mt-1 text-accent flex-shrink-0" />
                <div>
                  <a 
                    href="mailto:info@impactinitiativenepal.com" 
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth"
                  >
                    info@impactinitiativenepal.com
                  </a>
                  <p className="text-xs text-primary-foreground/60 mt-1">
                    Response within 24 hours
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-1 text-accent flex-shrink-0" />
                <div>
                  <span className="text-primary-foreground/80">Kathmandu, Nepal</span>
                  <p className="text-xs text-primary-foreground/60 mt-1">
                    Serving all 7 provinces
                  </p>
                </div>
              </div>
            </div>

            <h5 className="font-semibold mb-3 text-sm">Resources</h5>
            <ul className="space-y-2 text-xs">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a 
                    href={resource.href} 
                    className="text-primary-foreground/60 hover:text-primary-foreground/80 transition-smooth"
                  >
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-primary-foreground/60 text-center md:text-left">
              <p>&copy; 2024 Impact Initiative Nepal. All rights reserved.</p>
              <p className="mt-1">Registered Non-Profit Organization | Tax ID: [Number]</p>
            </div>
            <div className="flex space-x-6 text-xs text-primary-foreground/60">
              <a href="#" className="hover:text-primary-foreground/80 transition-smooth">Privacy Policy</a>
              <a href="#" className="hover:text-primary-foreground/80 transition-smooth">Terms of Service</a>
              <a href="#" className="hover:text-primary-foreground/80 transition-smooth">Annual Reports</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;