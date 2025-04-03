import { useGameStore } from '../../store/gameState';

const COLORS = [
  { color: '#ffffff', label: 'White' },
  { color: '#ff0000', label: 'Red' },
  { color: '#00ff00', label: 'Green' },
  { color: '#0000ff', label: 'Blue' },
  { color: '#ffff00', label: 'Yellow' },
  { color: '#ff00ff', label: 'Magenta' },
];

export default function ColorToolbar() {
  const selectedColor = useGameStore((state) => state.selectedColor);
  const setSelectedColor = useGameStore((state) => state.setSelectedColor);

  return (
    <div className='fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 bg-black/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/10 z-50'>
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
            <div className='absolute bottom-0 left-0 right-0 h-1 bg-black/20'></div>
          </button>
        ))}
      </div>
    </div>
  );
}
