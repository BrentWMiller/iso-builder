import { useState } from 'react';
import { useGameStore } from '../../store/gameState';
import { SavedBuild } from '../../store/types';

export default function BuildManager() {
  const [isOpen, setIsOpen] = useState(false);
  const savedBuilds = useGameStore((state) => state.savedBuilds);
  const saveBuild = useGameStore((state) => state.saveBuild);
  const loadBuild = useGameStore((state) => state.loadBuild);
  const deleteBuild = useGameStore((state) => state.deleteBuild);
  const exportBuild = useGameStore((state) => state.exportBuild);
  const importBuild = useGameStore((state) => state.importBuild);

  const [newBuildName, setNewBuildName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState('');

  const handleSave = () => {
    if (newBuildName.trim()) {
      saveBuild(newBuildName.trim());
      setNewBuildName('');
    }
  };

  const handleImport = () => {
    if (importData.trim()) {
      importBuild(importData.trim());
      setImportData('');
      setIsImporting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className='fixed top-6 left-6 flex flex-col gap-2 z-50'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='px-4 py-2 bg-black/10 backdrop-blur-md text-white rounded-xl shadow-lg border border-white/10 hover:bg-black/20 transition-colors flex items-center gap-2'
      >
        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
          <path
            fillRule='evenodd'
            d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
            clipRule='evenodd'
          />
        </svg>
        <span>Builds</span>
      </button>

      {isOpen && (
        <div className='bg-black/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10 max-w-sm'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <h2 className='text-lg font-semibold text-white'>Saved Builds</h2>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={newBuildName}
                  onChange={(e) => setNewBuildName(e.target.value)}
                  placeholder='Build name'
                  className='flex-1 px-3 py-2 rounded-md bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30'
                />
                <button onClick={handleSave} className='px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors'>
                  Save
                </button>
              </div>
            </div>

            <div className='flex flex-col gap-2 max-h-96 overflow-y-auto'>
              {savedBuilds.map((build: SavedBuild) => (
                <div key={build.id} className='flex items-center justify-between gap-2 p-2 bg-white/5 rounded-md'>
                  <div className='flex-1'>
                    <div className='font-medium text-white'>{build.name}</div>
                    <div className='text-xs text-white/50'>Updated: {formatDate(build.updatedAt)}</div>
                  </div>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => loadBuild(build.id)}
                      className='px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors text-sm'
                    >
                      Load
                    </button>
                    <button
                      onClick={() => {
                        const data = exportBuild(build.id);
                        navigator.clipboard.writeText(data);
                      }}
                      className='px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors text-sm'
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => deleteBuild(build.id)}
                      className='px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-md transition-colors text-sm'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className='flex flex-col gap-2'>
              <button
                onClick={() => setIsImporting(!isImporting)}
                className='px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors'
              >
                {isImporting ? 'Cancel Import' : 'Import Build'}
              </button>
              {isImporting && (
                <div className='flex flex-col gap-2'>
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder='Paste build data here'
                    className='w-full px-3 py-2 rounded-md bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30'
                    rows={4}
                  />
                  <button onClick={handleImport} className='px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors'>
                    Import
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
