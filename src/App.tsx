import { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, ChevronDown } from 'lucide-react';
import { VapiWidget } from './components/VapiWidget';
import { useVapi } from './hooks/useVapi';

const services = [
  'Konservasi Gigi',
  'Bedah Mulut',
  'Periodonti',
  'Orthodonti',
  'Pedodonti',
  'Prosthodonti',
  'Implant Gigi',
  'Laser'
];

const preferredTimes = [
  'Pagi (08:00 - 12:00)',
  'Siang (12:00 - 15:00)',
  'Sore (15:00 - 18:00)',
  'Malam (18:00 - 20:00)'
];

function App() {
  const { isActive, toggleCall } = useVapi();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    preferredTime: '',
    notes: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Callback request:', formData);
    setShowSuccess(true);
    setFormData({ name: '', phone: '', service: '', preferredTime: '', notes: '' });
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">
            Grin Dental Specialist <span className="text-sm font-normal text-gray-500">(Testing)</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-gray-700 hover:text-gray-900">Services</a>
            <a href="#location" className="text-gray-700 hover:text-gray-900">Location</a>
            <a href="#contact" className="text-gray-700 hover:text-gray-900">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Dental Specialist Care, Fast Response
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-2">
            Testing website for AI Phone Caller assistant (inbound calls + callbacks).
          </p>
          <p className="text-sm text-gray-500 mb-8">Demo / testing site only.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={toggleCall}
              className={`px-8 py-4 rounded-lg transition flex items-center gap-2 font-semibold text-lg shadow-lg hover:shadow-xl w-full sm:w-auto justify-center ${
                isActive
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Phone size={22} />
              {isActive ? 'End Call' : 'Call Now'}
            </button>
            <a
              href="https://wa.me/6287878789737"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-semibold text-lg shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <MessageCircle size={22} />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Our Services</h2>
          <p className="text-center text-gray-600 mb-10">Tap Call for schedule & pricing.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <div
                key={service}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition text-center"
              >
                <h3 className="font-semibold text-gray-900">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Location</h2>
          <div className="bg-white rounded-lg shadow-sm p-8 inline-block">
            <MapPin className="inline-block text-blue-600 mb-2" size={28} />
            <p className="text-gray-700 font-medium">Jl. Dental Care Raya, Bekasi</p>
            <p className="text-gray-500 text-sm mt-1">Two branches (demo)</p>
          </div>
        </div>
      </section>

      {/* Callback Form */}
      <section id="callback" className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Request a Callback</h2>
          <p className="text-center text-gray-600 mb-8">Our AI caller will contact you (demo).</p>

          {showSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
              Callback request received! Our AI caller will contact you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8 space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="08XX-XXXX-XXXX"
              />
            </div>

            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                Service
              </label>
              <div className="relative">
                <select
                  id="service"
                  required
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div>
              <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time
              </label>
              <div className="relative">
                <select
                  id="preferredTime"
                  required
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                >
                  <option value="">Select time</option>
                  {preferredTimes.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Any specific concerns or questions?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Request Callback
            </button>
          </form>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Contact Us</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={toggleCall}
              className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition group"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition ${
                isActive
                  ? 'bg-red-600'
                  : 'bg-blue-100 group-hover:bg-blue-600'
              }`}>
                <Phone className={`transition ${
                  isActive
                    ? 'text-white'
                    : 'text-blue-600 group-hover:text-white'
                }`} size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{isActive ? 'End Call' : 'Call Us'}</h3>
              <p className="text-gray-600">021-8242-7029</p>
            </button>

            <a
              href="https://wa.me/6287878789737"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition group"
            >
              <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition">
                <MessageCircle className="text-green-600 group-hover:text-white transition" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-gray-600">0878-7878-9737</p>
            </a>

            <a
              href="mailto:grindental.cs@gmail.com"
              className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition group"
            >
              <div className="bg-gray-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-600 transition">
                <Mail className="text-gray-600 group-hover:text-white transition" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 text-sm">grindental.cs@gmail.com</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="font-semibold text-white mb-2">Demo / Testing website only.</p>
          <p className="text-sm">
            Information provided is general and not medical advice. Always consult with qualified healthcare professionals.
          </p>
          <p className="text-sm mt-4 text-gray-500">
            &copy; 2026 Grin Dental Specialist (Testing)
          </p>
        </div>
      </footer>

      <VapiWidget />

    </div>
  );
}

export default App;
