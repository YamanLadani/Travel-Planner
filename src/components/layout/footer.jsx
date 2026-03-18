import { Link } from 'react-router-dom'
import { Globe, Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    TravelPlanner
                  </span>
                  <div className="text-xs text-gray-400">Your AI Travel Companion</div>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Discover amazing places, create unforgettable memories, and plan the perfect trip with AI-powered recommendations and smart itineraries.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors duration-200 group">
                  <Facebook className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </a>
                <a href="#" className="p-2 bg-gray-800 hover:bg-blue-400 rounded-lg transition-colors duration-200 group">
                  <Twitter className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </a>
                <a href="#" className="p-2 bg-gray-800 hover:bg-pink-600 rounded-lg transition-colors duration-200 group">
                  <Instagram className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </a>
                <a href="#" className="p-2 bg-gray-800 hover:bg-red-600 rounded-lg transition-colors duration-200 group">
                  <Youtube className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </a>
              </div>
            </div>

            {/* Explore Section */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Explore</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/explore" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Nearby Places
                  </Link>
                </li>
                <li>
                  <Link to="/trips" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Trip Planner
                  </Link>
                </li>
                <li>
                  <Link to="/destinations" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Popular Destinations
                  </Link>
                </li>
                <li>
                  <Link to="/guides" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Travel Guides
                  </Link>
                </li>
                <li>
                  <Link to="/experiences" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Local Experiences
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Travel Blog
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/press" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Press Kit
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm">Email us</p>
                    <a href="mailto:hello@travelplanner.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                      hello@travelplanner.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm">Call us</p>
                    <a href="tel:+1234567890" className="text-blue-400 hover:text-blue-300 transition-colors">
                      +1 (234) 567-8900
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm">Visit us</p>
                    <p className="text-gray-400 text-sm">123 Travel Street<br />Adventure City, AC 12345</p>
                  </div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="mt-6">
                <p className="text-gray-300 text-sm mb-3">Stay updated with travel tips</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors duration-200">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center text-gray-400 text-sm">
                <span>Made with</span>
                <Heart className="h-4 w-4 mx-1 text-red-500 fill-current" />
                <span>by the TravelPlanner Team © {new Date().getFullYear()}</span>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}