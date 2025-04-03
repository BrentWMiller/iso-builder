import { useGameStore } from '../../store/gameState';
import { blockRegistry } from '../../plugins/blocks';

export default function BlockToolbar() {
  const selectedBlockType = useGameStore((state) => state.selectedBlockType);
  const setSelectedBlockType = useGameStore((state) => state.setSelectedBlockType);

  const plugins = blockRegistry.getAll();

  return (
    <div className='fixed bottom-24 left-1/2 -translate-x-1/2 flex flex-col gap-2 bg-black/10 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/10 z-50'>
      <div className='sr-only'>Block Types</div>
      <div className='flex items-center gap-2'>
        {plugins.map((plugin) => (
          <button
            key={plugin.type}
            className={`relative w-10 h-10 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-md overflow-hidden ${
              selectedBlockType === plugin.type ? 'ring-2 ring-white scale-105 shadow-md' : 'ring-1 ring-white/20'
            }`}
            onClick={() => setSelectedBlockType(plugin.type)}
            title={plugin.description}
            aria-label={`Select ${plugin.displayName} block`}
          >
            <div className='absolute inset-0 flex items-center justify-center text-white/80 font-medium'>{plugin.displayName.charAt(0)}</div>
            <div className='absolute bottom-0 left-0 right-0 h-1.5 bg-black/5 rounded-full'></div>
          </button>
        ))}
      </div>
    </div>
  );
}
