import React from 'react';
import { 
  FaAngleDoubleRight, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaTiktok,
  FaInstagram,
  FaFacebook
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand & About */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            Royal Laundry & Dry Cleaners
          </h3>
          <p className="text-sm leading-relaxed">
            Laundry? Let’s make it <span className="font-semibold text-yellow-400">ROYAL</span>. 
            Premium wash, dry, iron, fold & pick-up service in Eldoret.
          </p>

          {/* QR Code
          <div className="mt-6">
            <p className="text-xs text-gray-400 mb-2">Scan to follow us!</p>
            <div className="bg-white p-3 rounded-xl shadow-lg inline-block">
              <img 
                src="/qr-royallaundry.png" 
                alt="Royal Laundry QR Code" 
                className="w-32 h-32 object-contain"
              />
            </div>
            <p className="text-xs text-center mt-2 text-yellow-400 font-medium">
              @royallaundry140
            </p>
          </div> */}
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'Home', href: '/' },
              { label: 'Our Services', href: '/services' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Location', href: '/location' },
              { label: 'Contact Us', href: '/contact' },
              { label: 'About Us', href: '/about' },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex items-center gap-2 hover:text-yellow-400 transition-colors duration-200 group"
                >
                  <FaAngleDoubleRight className="text-yellow-500 text-xs group-hover:translate-x-1 transition-transform" />
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Location & Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaMapMarkerAlt className="text-yellow-500" />
            Find Us
          </h3>
          <div className="space-y-3 text-sm">
            <p className="text-gray-400">Eldoret, Kenya</p>
            <a
              href="https://maps.google.com/maps?q=0.5411099,35.2982391&z=17&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-yellow-600 text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-yellow-500 transition-colors"
            >
              <FaMapMarkerAlt />
              Open in Maps
            </a>
          </div>

          {/* Contact Info */}
          <div className="mt-6 space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <FaPhone className="text-yellow-500" />
              <a href="tel:+254700000000" className="hover:text-yellow-400">+254 743 180 071</a>
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-yellow-500" />
              <a 
                href="mailto:royallaundry140@gmail.com" 
                className="hover:text-yellow-400 break-all"
              >
                royallaundry140@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Services + Socials */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Our Services</h3>
          <ul className="space-y-2 text-sm mb-6">
            {['Wash & Dry', 'Iron & Fold', 'Pick & Drop', 'Dry Cleaning'].map((service) => (
              <li
                key={service}
                className="flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-yellow-500 before:rounded-full"
              >
                {service}
              </li>
            ))}
          </ul>

          {/* Social Media */}
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex gap-4 text-2xl">
            <a
              href="https://www.tiktok.com/@royallaundry140"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400 transition-colors"
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
            <a
              href="https://www.instagram.com/royallaundry140"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400 transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61583850053648"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400 transition-colors"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            DM to book your pickup! Fresh mood guaranteed.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        <p>
          © {new Date().getFullYear()} <span className="text-yellow-400 font-medium">Royal Laundry & Dry Cleaners</span>. 
          All rights reserved. | Eldoret, Kenya
        </p>
      </div>
    </footer>
  );
}