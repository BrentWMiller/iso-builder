# Isometric Block Builder

A creative 3D block-building game built with React Three Fiber with an isometric perspective.

## Features

### Core Mechanics

- Isometric camera perspective with fixed viewing angle
- Block placement system with grid snapping
- Block stacking and side attachment mechanics
- Block type selection system
- Block removal/destruction

### Block Properties

- Different block types (basic cubes, stairs, slabs)
- Block textures and materials
- Basic color customization
- Block highlighting on hover

### User Interface

- Block selection toolbar
- Simple HUD for game controls
- Block type inventory
- Undo/Redo functionality
- Save/Load system for creations

## Technology Stack

### Core Technologies

- React 19
- Three.js
- React Three Fiber
- React Three Drei
- TypeScript
- Vite
- TailwindCSS
- Framer Motion

### State Management

- Zustand (for game state)
- Immer (for immutable state updates)

### Development Tools

- ESLint
- Prettier
- Vitest (testing)
- Husky (git hooks)

## Project Structure

```
src/
├── assets/         # Static assets and textures
├── components/     # React components
├── hooks/          # Custom React hooks
├── store/          # Zustand store and state management
├── utils/          # Utility functions and helpers
├── App.tsx         # Main application component
├── main.tsx        # Application entry point
├── setupTests.ts   # Test configuration
└── constants.ts    # Application constants
```

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Development Workflow

1. Create feature branches from `main`
2. Follow conventional commits
3. Submit PRs with description of changes
4. Ensure all tests pass
5. Review and merge

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## License

MIT License
