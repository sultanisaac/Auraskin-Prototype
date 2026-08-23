"use client";

export default function PrintButtons() {
  return (
    <div className="mt-12 text-center text-gray-500 text-sm print:hidden">
      <button 
        onClick={() => window.print()}
        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors mr-4"
      >
        Print Receipt
      </button>
      <button 
        onClick={() => window.close()}
        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Close Window
      </button>
    </div>
  );
}
