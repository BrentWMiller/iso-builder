import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((callback) => {
  callback(0);
  return 0;
});

// Mock WebGL context
const mockWebGLContext = {
  canvas: document.createElement('canvas'),
  drawingBufferWidth: 0,
  drawingBufferHeight: 0,
  drawingBufferColorSpace: 'srgb',
  getContextAttributes: () => ({
    alpha: true,
    antialias: true,
    depth: true,
    failIfMajorPerformanceCaveat: false,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    stencil: true,
  }),
  getExtension: () => null,
  getParameter: () => {},
  getShaderPrecisionFormat: () => ({
    precision: 1,
    rangeMin: 1,
    rangeMax: 1,
  }),
  createBuffer: () => ({}),
  createFramebuffer: () => ({}),
  createProgram: () => ({}),
  createRenderbuffer: () => ({}),
  createShader: () => ({}),
  createTexture: () => ({}),
  bindBuffer: () => {},
  bindFramebuffer: () => {},
  bindRenderbuffer: () => {},
  bindTexture: () => {},
  drawArrays: () => {},
  drawElements: () => {},
  activeTexture: () => {},
  attachShader: () => {},
  bindAttribLocation: () => {},
} as unknown as WebGLRenderingContext;

// Mock canvas getContext
const getContextProxy = new Proxy(HTMLCanvasElement.prototype.getContext, {
  apply(target, thisArg, args) {
    const [contextId] = args;
    if (contextId === 'webgl' || contextId === 'webgl2') {
      return mockWebGLContext;
    }
    return target.apply(thisArg, args);
  },
});

HTMLCanvasElement.prototype.getContext = getContextProxy;
