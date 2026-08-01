import { Award, Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

export default function ExpertsPage() {
  const navigate = useNavigate();
  const doctors = [
    { name: 'Dr. Amanda Wijaya', role: 'Aesthetic Medicine', exp: '12 Years Exp.', spec: 'Laser & Rejuvenation', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=800&fit=crop&q=80' },
    { name: 'Dr. Budi Santoso', role: 'Dermatologist', exp: '15 Years Exp.', spec: 'Acne & Scar Treatment', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&h=800&fit=crop&q=80' },
    { name: 'Dr. Clara Lee', role: 'Aesthetic Doctor', exp: '8 Years Exp.', spec: 'Facial Contouring', img: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=600&h=800&fit=crop&q=80' }
  ];

  return (
    <div className="pt-24 pb-16 bg-background min-h-[calc(100vh-200px)]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition font-medium text-sm mb-8 md:mb-10">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="text-center mb-10 md:mb-16">
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
                <Link to={`/book-consultation?doctor=${encodeURIComponent(doc.name)}`} className="w-full block">
                  <Button variant="outline" className="w-full text-sm py-3">
                    Book with {doc.name.split(' ')[1]}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
