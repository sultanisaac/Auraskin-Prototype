import { ExternalLink, ShieldCheck } from 'lucide-react';

export const AdminDemoWidget = () => {
  return (
    <a
      href="https://admin-auraskin-prototype.vercel.app/"
      target="_blank"
      rel="noreferrer"
      className="fixed top-24 right-4 md:top-28 md:right-6 bg-white/95 backdrop-blur-md border border-gray-100 shadow-[0_8px_30px_rgba(15,76,92,0.15)] rounded-2xl p-3 md:p-4 flex flex-col gap-2 z-[45] max-w-[140px] md:max-w-[200px] hover:shadow-[0_12px_40px_rgba(15,76,92,0.25)] hover:-translate-y-1 transition-all group overflow-hidden cursor-pointer"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-secondary/10 rounded-bl-[100%] -z-10 group-hover:scale-125 transition-transform duration-500"></div>
      
      <div className="flex items-center gap-2 text-primary font-bold">
        <div className="bg-primary/5 p-1.5 rounded-lg text-primary group-hover:bg-primary/10 transition-colors">
          <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        <span className="text-xs md:text-sm font-serif">Admin Demo</span>
      </div>
      
      <p className="text-[10px] md:text-xs text-gray-600 leading-tight">
        Try confirming or declining appointments here.
      </p>
      
      <div className="flex items-center gap-1 text-[9px] md:text-[10px] uppercase font-bold tracking-wider text-secondary mt-1 group-hover:text-primary transition-colors">
        <span>Open Admin</span>
        <ExternalLink className="w-2.5 h-2.5 md:w-3 md:h-3" />
      </div>
    </a>
  );
};
