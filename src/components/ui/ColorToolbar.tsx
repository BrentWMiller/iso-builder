import { useGameStore } from '../../store/gameState';

const COLORS = [
  { color: '#ffffff', label: 'White' },
  { color: '#FF6B6B', label: 'Coral' },
  { color: '#4ECDC4', label: 'Turquoise' },
  { color: '#45B7D1', label: 'Sky Blue' },
  { color: '#96CEB4', label: 'Mint' },
  { color: '#FFEEAD', label: 'Cream' },
  { color: '#D4A5A5', label: 'Dusty Rose' },
  { color: '#9B59B6', label: 'Amethyst' },
  { color: '#3498DB', label: 'Electric Blue' },
  { color: '#2ECC71', label: 'Emerald' },
  { color: '#F1C40F', label: 'Sunflower' },
  { color: '#E67E22', label: 'Carrot' },
];

export default function ColorToolbar() {
  const selectedColor = useGameStore((state) => state.selectedColor);
  const setSelectedColor = useGameStore((state) => state.setSelectedColor);

  return (
    <div className='fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 bg-black/10 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/10 z-50'>
      <div className='sr-only'>Color Palette</div>
      <div className='flex items-center gap-2'>
        {COLORS.map(({ color, label }) => (
          <button
            key={color}
            className={`relative w-10 h-10 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-md overflow-hidden ${
              selectedColor === color ? 'ring-2 ring-white scale-105 shadow-md' : 'ring-1 ring-white/20'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select ${label} color`}
          >
            <div className='absolute bottom-0 left-0 right-0 h-1.5 bg-black/5 rounded-full'></div>
          </button>
        ))}
      </div>
    </div>
  );
}
