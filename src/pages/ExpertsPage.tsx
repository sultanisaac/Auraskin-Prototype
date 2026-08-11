"use client";

import { Award, Sparkles, ArrowLeft, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../components/Button';

export default function ExpertsPage() {
  const router = useRouter();
  const navigate = (path: string | -1) => { if (path === -1) router.back(); else router.push(path); };
  const doctors = [
    { name: 'Dr. Amanda Wijaya', role: 'Aesthetic Medicine', exp: '12 Years Exp.', spec: 'Laser & Rejuvenation', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=800&fit=crop&q=80' },
    { name: 'Dr. Budi Santoso', role: 'Dermatologist', exp: '15 Years Exp.', spec: 'Acne & Scar Treatment', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&h=800&fit=crop&q=80' },
    { name: 'Dr. Clara Lee', role: 'Aesthetic Doctor', exp: '8 Years Exp.', spec: 'Facial Contouring', img: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=600&h=800&fit=crop&q=80' }
  ];

  return (
    <div className="pt-20 pb-12 md:pb-16 bg-background min-h-[calc(100vh-200px)]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition font-medium text-sm mb-6 md:mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="text-center mb-8 md:mb-10">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-4">Meet Our Experts</h2>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">Board-certified specialists dedicated to your skin's health and beauty.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {doctors.map((doc, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <img src={doc.img} alt={doc.name} className="w-full h-72 md:h-80 object-cover object-top" loading="lazy" />
                <div className="p-6 md:p-8">
                  <h3 className="font-serif font-bold text-xl md:text-2xl text-primary mb-1">{doc.name}</h3>
                  <p className="text-secondary font-medium text-sm md:text-base mb-5">{doc.role}</p>
                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-3"><Award className="w-5 h-5 text-primary shrink-0" /> {doc.exp}</div>
                    <div className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-primary shrink-0" /> {doc.spec}</div>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-8 pt-0 mt-auto">
                <Link href={`/book-consultation?doctor=${encodeURIComponent(doc.name)}`} className="w-full block">
                  <Button variant="outline" className="w-full text-sm py-3">
                    Book with {doc.name.split(' ')[1]}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-12 md:mt-16 bg-gray-50/80 rounded-3xl p-8 md:p-12 text-center border border-gray-100 max-w-4xl mx-auto shadow-sm">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-3">Still have questions?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto text-sm md:text-base">
            Our clinical team is always ready to help. Reach out to us directly or book a free consultation to discuss your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/book-consultation" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full px-8 py-3.5 shadow-sm text-sm font-semibold">
                Book Consultation
              </Button>
            </Link>
            <a href="https://wa.me/6281288882828" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full px-8 py-3.5 flex items-center justify-center gap-2 text-sm font-semibold border-gray-300 text-gray-800 hover:bg-gray-50 hover:text-gray-900">
                <MessageCircle className="w-4.5 h-4.5" /> Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
