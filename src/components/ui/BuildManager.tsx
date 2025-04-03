import { useState, ChangeEvent } from 'react';
import { useGameStore } from '../../store/gameState';
import { SavedBuild } from '../../store/types';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { Menu, Save, Upload, Download, Copy, Trash2, X } from 'lucide-react';

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

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (importData.trim()) {
      try {
        // Try to decode the input to validate it's base64
        atob(importData.trim());
        importBuild(importData.trim());
        setImportData('');
        setIsImporting(false);
      } catch {
        // If it's not base64, try to import as plain JSON
        try {
          JSON.parse(importData.trim());
          importBuild(btoa(importData.trim()));
          setImportData('');
          setIsImporting(false);
        } catch (error) {
          if (error instanceof Error) {
            console.error('Invalid build data format:', error.message);
          } else {
            console.error('Invalid build data format');
          }
        }
      }
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
        className='bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md text-neutral-900 dark:text-neutral-100 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200/80 dark:hover:bg-neutral-800/80 transition-colors flex items-center gap-2'
      >
        <Menu className='h-5 w-5' />
        <span>Builds</span>
      </Button>

      {isOpen && (
        <div className='bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 max-w-sm max-h-[calc(100vh-8rem)] overflow-y-auto'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <h2 className='text-lg font-semibold text-neutral-900 dark:text-neutral-100'>Saved Builds</h2>
              <div className='flex gap-2'>
                <Input
                  type='text'
                  value={newBuildName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewBuildName(e.target.value)}
                  placeholder='Build name'
                  className='flex-1 bg-white/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 border-neutral-200 dark:border-neutral-800'
                />
                <Button
                  onClick={handleSave}
                  variant='secondary'
                  className='bg-neutral-200/80 dark:bg-neutral-800/80 hover:bg-neutral-300/80 dark:hover:bg-neutral-700/80'
                >
                  <Save className='h-4 w-4 mr-2' />
                  Save
                </Button>
              </div>
            </div>

            <div className='flex flex-col gap-2 max-h-96 overflow-y-auto'>
              {savedBuilds.map((build: SavedBuild) => (
                <div
                  key={build.id}
                  className='group flex items-center justify-between gap-2 p-2 bg-white/50 dark:bg-neutral-800/50 rounded-md hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 transition-colors'
                >
                  <div className='flex-1 text-left'>
                    <div className='font-medium text-neutral-900 dark:text-neutral-100'>{build.name}</div>
                    <div className='text-xs text-neutral-500 dark:text-neutral-400'>Updated: {formatDate(build.updatedAt)}</div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80'
                      >
                        <Menu className='h-5 w-5' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'>
                      <DropdownMenuItem
                        onClick={() => loadBuild(build.id)}
                        className='text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer'
                      >
                        <Download className='h-4 w-4 mr-2' />
                        Load Build
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleCopy(build.id)}
                        className='text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer'
                      >
                        <Copy className='h-4 w-4 mr-2' />
                        Copy Build Data
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteBuild(build.id)}
                        className='text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer'
                      >
                        <Trash2 className='h-4 w-4 mr-2' />
                        Delete Build
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>

            <div className='flex flex-col gap-2'>
              <Button
                onClick={() => setIsImporting(!isImporting)}
                variant='secondary'
                className='bg-neutral-200/80 dark:bg-neutral-800/80 hover:bg-neutral-300/80 dark:hover:bg-neutral-700/80'
              >
                {isImporting ? (
                  <>
                    <X className='h-4 w-4 mr-2' />
                    Cancel Import
                  </>
                ) : (
                  <>
                    <Upload className='h-4 w-4 mr-2' />
                    Import Build
                  </>
                )}
              </Button>
              {isImporting && (
                <form onSubmit={handleImport} data-testid='import-form'>
                  <Textarea
                    placeholder='Paste build data here'
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    className='max-h-48 bg-white/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 border-neutral-200 dark:border-neutral-800 resize-none'
                    rows={4}
                  />
                  <div className='flex gap-2 mt-2'>
                    <Button type='submit'>Import</Button>
                    <Button variant='outline' onClick={() => setIsImporting(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
