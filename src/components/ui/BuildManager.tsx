import { useState, ChangeEvent } from 'react';
import { useGameStore } from '../../store/gameState';
import { SavedBuild } from '../../store/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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

  const handleCopy = (id: string) => {
    const data = exportBuild(id);
    navigator.clipboard.writeText(data);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className='fixed top-6 left-6 flex flex-col gap-2 z-50'>
      <Button
        variant='ghost'
        onClick={() => setIsOpen(!isOpen)}
        className='bg-black/10 backdrop-blur-md text-white rounded-xl shadow-lg border border-white/10 hover:bg-black/20 transition-colors flex items-center gap-2'
      >
        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
          <path
            fillRule='evenodd'
            d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
            clipRule='evenodd'
          />
        </svg>
        <span>Builds</span>
      </Button>

      {isOpen && (
        <div className='bg-black/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10 max-w-sm'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <h2 className='text-lg font-semibold text-white'>Saved Builds</h2>
              <div className='flex gap-2'>
                <Input
                  type='text'
                  value={newBuildName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewBuildName(e.target.value)}
                  placeholder='Build name'
                  className='flex-1 bg-white/10 text-white placeholder-white/50 border-white/20'
                />
                <Button onClick={handleSave} variant='secondary' className='bg-white/20 hover:bg-white/30'>
                  Save
                </Button>
              </div>
            </div>

            <div className='flex flex-col gap-2 max-h-96 overflow-y-auto'>
              {savedBuilds.map((build: SavedBuild) => (
                <div
                  key={build.id}
                  className='group flex items-center justify-between gap-2 p-2 bg-white/5 rounded-md hover:bg-white/10 transition-colors'
                >
                  <div className='flex-1'>
                    <div className='font-medium text-white'>{build.name}</div>
                    <div className='text-xs text-white/50'>Updated: {formatDate(build.updatedAt)}</div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon' className='text-white/50 hover:text-white hover:bg-white/10'>
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                          <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='bg-black/90 backdrop-blur-md border-white/10'>
                      <DropdownMenuItem onClick={() => loadBuild(build.id)} className='text-white hover:bg-white/10 cursor-pointer'>
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 mr-2' viewBox='0 0 20 20' fill='currentColor'>
                          <path
                            fillRule='evenodd'
                            d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                        Load Build
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopy(build.id)} className='text-white hover:bg-white/10 cursor-pointer'>
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 mr-2' viewBox='0 0 20 20' fill='currentColor'>
                          <path d='M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z' />
                          <path d='M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z' />
                        </svg>
                        Copy Build Data
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteBuild(build.id)} className='text-red-500 hover:bg-white/10 cursor-pointer'>
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 mr-2' viewBox='0 0 20 20' fill='currentColor'>
                          <path
                            fillRule='evenodd'
                            d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                        Delete Build
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>

            <div className='flex flex-col gap-2'>
              <Button onClick={() => setIsImporting(!isImporting)} variant='secondary' className='bg-white/20 hover:bg-white/30'>
                {isImporting ? 'Cancel Import' : 'Import Build'}
              </Button>
              {isImporting && (
                <div className='flex flex-col gap-2'>
                  <Textarea
                    value={importData}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setImportData(e.target.value)}
                    placeholder='Paste build data here'
                    className='bg-white/10 text-white placeholder-white/50 border-white/20'
                    rows={4}
                  />
                  <Button onClick={handleImport} variant='secondary' className='bg-white/20 hover:bg-white/30'>
                    Import
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
