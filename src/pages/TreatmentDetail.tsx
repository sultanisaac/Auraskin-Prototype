"use client";

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '../components/Button';
import { Clock, Check, ArrowRight, ArrowLeft, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const treatmentsData: Record<string, any> = {
  'acne-clarity': {
    name: 'Acne & Clarity Treatment',
    price: 'Rp 799.000',
    time: '60 mins',
    heroImg: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=2400&h=1000&q=80',
    overview: 'Reclaim your confidence with a clear, glowing complexion. A gentle yet effective approach to purifying and balancing troubled skin.',
    details: 'Our Acne & Clarity Treatment is a multi-step clinical procedure designed to combat active breakouts, reduce inflammation, and prevent future acne formation. Using advanced micro-extraction techniques combined with blue-light therapy, this treatment targets acne-causing bacteria deep within the pores without damaging the surrounding tissue. It is the perfect reset for stressed, congested skin.',
    benefits: [
      'Soothes active inflammation immediately',
      'Purifies congested pores and removes blackheads',
      'Restores the skin\'s natural moisture barrier',
      'Fades post-acne hyperpigmentation (dark spots)',
      'Regulates sebum production for long-term clarity'
    ],
    process: [
      { step: '1. Clinical Cleansing', desc: 'Deep pore cleansing to remove surface impurities and excess oil.' },
      { step: '2. Exfoliation & Steam', desc: 'Gentle enzymatic exfoliation under clinical steam to open pores.' },
      { step: '3. Precision Extraction', desc: 'Painless removal of comedones and active acne lesions.' },
      { step: '4. Blue Light Therapy', desc: 'Targeted LED therapy to destroy acne bacteria.' },
      { step: '5. Calming Mask', desc: 'A soothing botanical mask to reduce redness and hydrate.' }
    ],
    aftercare: 'Avoid direct sun exposure and strenuous exercise for 24 hours. Do not use active ingredients (AHAs, BHAs, Retinol) for 3 days post-treatment. Apply a gentle moisturizer and SPF 50 daily.'
  },
  'luminous-glass-skin': {
    name: 'Luminous Glass Skin',
    price: 'Rp 999.000',
    time: '90 mins',
    heroImg: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2400&h=1000&q=80',
    overview: 'A deeply nourishing journey to lasting radiance. Plump, hydrate, and revive your skin for that coveted dewy finish.',
    details: 'The Luminous Glass Skin treatment is our signature hydration protocol, inspired by Korean beauty standards. It utilizes a transdermal infusion system to deliver potent hyaluronic acid, vitamins, and antioxidants directly into the dermis. This non-invasive procedure intensely hydrates the skin from the inside out, resulting in a translucent, poreless, and highly reflective "glass-like" appearance.',
    benefits: [
      'Intense cellular hydration that lasts for weeks',
      'Silky smooth texture and minimized pore appearance',
      'Immediate, visible "glass skin" glow',
      'Plumps fine lines and dehydration wrinkles',
      'Boosts overall skin health and elasticity'
    ],
    process: [
      { step: '1. Double Cleanse', desc: 'Thorough removal of makeup, SPF, and urban pollutants.' },
      { step: '2. Aqua Peel', desc: 'Gentle vacuum exfoliation to smooth the skin surface.' },
      { step: '3. Vitamin Infusion', desc: 'Sonophoresis technology drives serums deep into the skin.' },
      { step: '4. Cryo-Therapy', desc: 'Cooling therapy to lock in nutrients and tighten pores.' },
      { step: '5. Luminous Modeling Mask', desc: 'An algae-based mask that forces hydration into the dermis.' }
    ],
    aftercare: 'Do not wash your face for at least 6 hours post-treatment to allow serums to fully absorb. Maintain hydration by drinking plenty of water and applying a hyaluronic acid serum twice daily.'
  },
  'pico-brilliance': {
    name: 'Pico Brilliance Therapy',
    price: 'Rp 1.490.000',
    time: '45 mins',
    heroImg: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=2400&h=1000&q=80',
    overview: 'Shatter pigmentation and unveil a flawless canvas. Our advanced laser technology brings your skin tone into perfect harmony.',
    details: 'Pico Brilliance Therapy utilizes state-of-the-art picosecond laser technology. Unlike traditional lasers that rely on heat, Pico lasers deliver ultra-short bursts of energy in trillionths of a second. This creates a photomechanical impact that shatters unwanted pigment (like melasma, sun spots, and acne scars) into tiny particles that your body naturally eliminates, all while stimulating collagen production with zero social downtime.',
    benefits: [
      'Dramatically evens skin tone and removes pigmentation',
      'Fades stubborn dark spots, melasma, and freckles',
      'Zero social downtime (minimal redness)',
      'Stimulates collagen and elastin for tighter skin',
      'Safe for all skin types, including darker skin tones'
    ],
    process: [
      { step: '1. Consultation & Skin Analysis', desc: 'Precise mapping of pigmentation depth and severity.' },
      { step: '2. Numbing Cream (Optional)', desc: 'Applied for 15 minutes to ensure absolute comfort.' },
      { step: '3. Pico Laser Pass', desc: 'Targeted laser application to shatter pigment.' },
      { step: '4. Fractional Rejuvenation Pass', desc: 'A second pass to stimulate collagen in the dermis.' },
      { step: '5. Recovery Serum', desc: 'Application of growth factors to accelerate healing.' }
    ],
    aftercare: 'Strict sun avoidance is mandatory. Apply SPF 50+ every 2 hours if outdoors. You may experience mild redness for 1-2 hours. Avoid saunas, hot yoga, and swimming for 48 hours.'
  },
  'youthful-contour': {
    name: 'Youthful Contour Infusion',
    price: 'Rp 2.490.000',
    time: '30 mins',
    heroImg: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=2400&h=1000&q=80',
    overview: 'Defy time with profound nourishment. Stimulate your skin’s innate collagen production for a lifted, rejuvenated appearance.',
    details: 'The Youthful Contour Infusion is our premium anti-aging treatment. It combines advanced Radio Frequency (RF) skin tightening with a potent cocktail of peptides and growth factors. The RF energy gently heats the deeper layers of the skin, causing immediate collagen contraction and stimulating long-term neocollagenesis. This results in a visibly lifted, firmer, and more youthful facial contour without needles or downtime.',
    benefits: [
      'Stimulates natural collagen and elastin production',
      'Softens fine expression lines and deep wrinkles',
      'Lifts and firms sagging skin, especially along the jawline',
      'Improves skin density and structural integrity',
      'Painless, relaxing procedure with immediate tightening effect'
    ],
    process: [
      { step: '1. Skin Prep', desc: 'Gentle cleansing and application of conductive gel.' },
      { step: '2. RF Contouring', desc: 'Targeted radio frequency energy applied to lift the lower face.' },
      { step: '3. Peptide Infusion', desc: 'Delivery of anti-aging peptides via electroporation.' },
      { step: '4. Sculpting Massage', desc: 'Manual lymphatic drainage to define facial contours.' },
      { step: '5. Firming Mask', desc: 'A specialized mask to seal in the lifting effect.' }
    ],
    aftercare: 'Your skin may feel warm and look slightly flushed for an hour. Avoid applying ice or cooling the face, as the heat helps stimulate collagen. Use a rich moisturizer and SPF daily.'
  }
};

export default function TreatmentDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  if (!id || !treatmentsData[id]) {
    return <Navigate to="/treatments" replace />;
  }

  const treatment = treatmentsData[id];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={treatment.heroImg} 
            alt={treatment.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-4 text-white/80 text-sm md:text-base font-medium tracking-widest uppercase mb-4">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {treatment.time}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
              <span>{treatment.price}</span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {treatment.name}
            </h1>
            <p className="text-gray-200 text-base md:text-xl font-light max-w-2xl mx-auto">
              {treatment.overview}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Back Button */}
        <div className="mb-10">
          <button onClick={() => router.back()} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>

        {/* Detail text */}
        <div className="mb-16">
          <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4">About The Treatment</h2>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed font-light">
            {treatment.details}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mb-16 p-8 md:p-12 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-6 h-6 text-primary" />
            <h3 className="font-serif text-2xl font-bold text-gray-900">Key Benefits</h3>
          </div>
          <ul className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {treatment.benefits.map((benefit: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-base leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6 text-primary" />
            <h3 className="font-serif text-2xl font-bold text-gray-900">Treatment Process</h3>
          </div>
          <div className="space-y-6">
            {treatment.process.map((p: any, idx: number) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="font-bold text-gray-900 w-48 shrink-0">{p.step}</div>
                <div className="text-gray-600 font-light">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Aftercare */}
        <div className="mb-16 p-8 bg-blue-50/50 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-gray-900">Important Aftercare</h4>
          </div>
          <p className="text-gray-700 leading-relaxed font-light">{treatment.aftercare}</p>
        </div>

        {/* Final CTA */}
        <div className="text-center pt-8 border-t border-gray-100">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-6">Ready to Experience the Glow?</h2>
          <Link href={`/book-consultation?treatment=${encodeURIComponent(treatment.name)}`}>
            <Button variant="primary" className="px-10 py-4 text-lg shadow-xl shadow-primary/20 w-full sm:w-auto">
              Reserve This Treatment <ArrowRight className="inline w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
