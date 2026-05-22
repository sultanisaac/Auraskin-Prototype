import { useVapi } from '../hooks/useVapi';

export function VapiWidget() {
  const { isActive, toggleCall } = useVapi();

  return (
    <button
      id="ai-phone"
      onClick={toggleCall}
      className={`fixed bottom-6 right-6 w-16 h-16 rounded-full border-0 text-white text-3xl cursor-pointer shadow-2xl transition-all duration-200 z-[9999] hover:scale-110 ${
        isActive
          ? 'bg-red-600 scale-110'
          : 'bg-green-700'
      }`}
    >
      {isActive ? '📴' : '📞'}
    </button>
  );
}
