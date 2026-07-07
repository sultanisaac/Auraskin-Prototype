import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Phone, Instagram } from 'lucide-react';

export const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-12">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <img src="/logo.png" alt="AuraSkin Logo" className="w-8 h-8 object-contain rounded-md shadow-sm" />
          <span className="font-serif text-2xl font-bold text-white">AuraSkin</span>
          <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold tracking-widest uppercase rounded">Prototype</span>
        </div>
        <p className="text-sm text-yellow-400 font-medium mb-4 italic">*This website is a design prototype for demonstration purposes only.*</p>
        <p className="mb-6">Natural Beauty. Expert Results. Premium aesthetic clinic in Jakarta.</p>
        <div className="flex space-x-4">
          <Instagram className="w-6 h-6 hover:text-white cursor-pointer transition" />
        </div>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4">Contact</h4>
        <ul className="space-y-3">
          <li className="flex gap-2"><MapPin className="w-5 h-5 shrink-0" /> SCBD Tower 2, Jl. Jend. Sudirman, Jakarta Selatan 12190</li>
          <li className="flex gap-2"><Phone className="w-5 h-5 shrink-0" /> +62 812 8888 2828</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4">Hours</h4>
        <ul className="space-y-2">
          <li>Monday to Friday: 09:00 to 20:00</li>
          <li>Saturday to Sunday: 09:00 to 18:00</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4">Links</h4>
        <ul className="space-y-2">
          <li><Link to="/#privacy" className="hover:text-white transition">Privacy Policy</Link></li>
          <li><Link to="/#terms" className="hover:text-white transition">Terms of Service</Link></li>
        </ul>
      </div>
    </div>
  </footer>
);
