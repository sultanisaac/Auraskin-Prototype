import { MapPin, Clock, Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ContactPage() {
  const navigate = useNavigate();
  return (
    <section className="py-16 md:py-24 bg-gray-50 min-h-[calc(100vh-200px)] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition font-medium text-sm mb-8 md:mb-10">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 text-primary font-medium text-xs mb-3">
            <MapPin className="w-3.5 h-3.5" /> Find Us
          </div>
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-gray-900 mb-3">Visit Our Clinic</h2>
          <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">Conveniently located in Jakarta's CBD. Easy access by car, MRT, or TransJakarta.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-200 h-[280px] sm:h-[350px] md:h-[420px]">
            <iframe title="AuraSkin Jakarta" src="https://maps.google.com/maps?q=SCBD+Tower+2+Jakarta+Selatan&output=embed&z=15" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div className="space-y-4">
            {[
              { icon: <MapPin className="w-5 h-5 text-primary" />, title: 'Address', content: <p className="text-gray-600 text-xs md:text-sm">SCBD Tower 2, Jl. Jend. Sudirman Kav. 52, 53,<br />Jakarta Selatan 12190, Indonesia</p> },
              { icon: <Clock className="w-5 h-5 text-primary" />, title: 'Clinic Hours', content: <div className="text-xs md:text-sm text-gray-600 space-y-1"><div className="flex justify-between gap-8"><span>Monday to Friday</span><span className="font-medium">09:00 to 20:00</span></div><div className="flex justify-between gap-8"><span>Saturday to Sunday</span><span className="font-medium">09:00 to 18:00</span></div></div> },
              { icon: <Phone className="w-5 h-5 text-primary" />, title: 'Contact', content: <p className="text-xs md:text-sm text-gray-600">WhatsApp: <a href="https://wa.me/6281288882828" className="text-primary font-medium hover:underline">+62 812 8888 2828</a></p> },
              { icon: <ArrowRight className="w-5 h-5 text-primary" />, title: 'Getting Here', content: <ul className="text-xs md:text-sm text-gray-600 space-y-1"><li>🚇 MRT: Senayan Station (5 min walk)</li><li>🚌 TransJakarta: Halte Bendungan Hilir</li><li>🚗 Valet parking available at SCBD Tower 2</li></ul> },
            ].map(({ icon, title, content }) => (
              <div key={title} className="flex gap-4 items-start bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
                <div className="bg-primary/10 p-2.5 md:p-3 rounded-xl shrink-0">{icon}</div>
                <div><h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">{title}</h4>{content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
