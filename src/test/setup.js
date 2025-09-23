import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Fix for CI environment
/* eslint-disable no-undef */
if (typeof global !== 'undefined' && !global.window) {
  global.window = global;
}
/* eslint-enable no-undef */

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock localStorage
const localStorageMock = {
  getItem: (key) => localStorageMock[key] || null,
  setItem: (key, value) => { localStorageMock[key] = value; },
  removeItem: (key) => { delete localStorageMock[key]; },
  clear: () => {
    Object.keys(localStorageMock).forEach(key => {
      if (key !== 'getItem' && key !== 'setItem' && key !== 'removeItem' && key !== 'clear') {
        delete localStorageMock[key];
      }
    });
  }
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock document.documentElement setAttribute and removeAttribute for theme switching tests
const mockSetAttribute = vi.fn();
const mockRemoveAttribute = vi.fn();

// Use spyOn to safely mock the methods
vi.spyOn(document.documentElement, 'setAttribute').mockImplementation(mockSetAttribute);
vi.spyOn(document.documentElement, 'removeAttribute').mockImplementation(mockRemoveAttribute);

// Reset mocks before each test
beforeEach(() => {
  mockSetAttribute.mockClear();
  mockRemoveAttribute.mockClear();
  localStorageMock.clear();
});

// Fix for webidl-conversions in CI environment
if (typeof globalThis !== 'undefined' && !globalThis.WeakMap) {
  globalThis.WeakMap = WeakMap;
}

// Additional polyfills for CI
/* eslint-disable no-undef */
if (typeof global !== 'undefined') {
  global.WeakMap = WeakMap;
  global.WeakSet = WeakSet;
  global.Map = Map;
  global.Set = Set;
}
/* eslint-enable no-undef */