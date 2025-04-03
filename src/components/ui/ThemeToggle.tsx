import { useGameStore } from '../../store/gameState';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const theme = useGameStore((state) => state.theme);
  const toggleTheme = useGameStore((state) => state.toggleTheme);

  return (
    <motion.button
      onClick={toggleTheme}
      className='fixed top-4 right-4 flex items-center justify-center size-10 !p-0 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-200 shadow-sm hover:shadow-md'
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {theme === 'dark' ? (
        <motion.svg
          data-testid='moon-icon'
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5 text-blue-400'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          initial={{ rotate: 0 }}
          animate={{ rotate: 45 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            repeat: 1,
          }}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
          />
        </motion.svg>
      ) : (
        <motion.svg
          data-testid='sun-icon'
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5 text-yellow-400'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          initial={{ rotate: 0 }}
          animate={{ rotate: 45 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            repeat: 1,
          }}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
          />
        </motion.svg>
      )}
    </motion.button>
  );
}
