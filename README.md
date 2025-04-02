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

### Interaction

- Mouse-based block placement
- Camera rotation controls (45-degree increments)
- Zoom controls
- Block face detection for accurate placement

## Technology Stack

### Core Technologies

- React 18+
- Three.js
- React Three Fiber
- React Three Drei (for helper components)
- TypeScript
- Vite (for build tooling)

### State Management

- Zustand (for game state)
- Immer (for immutable state updates)

### Development Tools

- ESLint
- Prettier
- Vitest (testing)

## Project Structure

```
src/
├── components/
│   ├── game/
│   │   ├── Block.tsx
│   │   ├── Grid.tsx
│   │   ├── Scene.tsx
│   │   └── Controls.tsx
│   └── ui/
│       ├── Toolbar.tsx
│       ├── HUD.tsx
│       └── Menu.tsx
├── hooks/
│   ├── useBlockPlacement.ts
│   ├── useGameControls.ts
│   └── useGrid.ts
├── store/
│   ├── gameState.ts
│   └── types.ts
├── utils/
│   ├── grid.ts
│   ├── math.ts
│   └── collision.ts
└── App.tsx
```

## Code Practices

### Performance Optimization

- Use React Three Fiber's built-in performance optimizations
- Implement object pooling for blocks
- Use instanced meshes for identical blocks
- Implement chunking for large builds
- Optimize raycasting operations

### State Management

- Centralize game state in Zustand store
- Use atomic state updates
- Implement undo/redo history
- Separate UI state from game state

### Code Quality

- Strong TypeScript typing
- Component composition over inheritance
- Custom hooks for reusable logic
- Pure functions for game mechanics
- Consistent naming conventions

### Testing Strategy

- Unit tests for utility functions
- Component tests for UI elements
- Integration tests for game mechanics
- Performance benchmarks

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

## Future Enhancements

- Multiplayer support
- Custom texture support
- Advanced block types
- World generation
- Physics simulation
- Mobile support

## Performance Targets

- 60 FPS minimum on modern browsers
- Support for 1000+ blocks in scene
- Responsive controls
- < 100ms input latency

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## License

MIT License
