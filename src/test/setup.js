import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

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

// Mock document.documentElement.setAttribute and removeAttribute
const mockSetAttribute = vi.fn();
const mockRemoveAttribute = vi.fn();
Object.defineProperty(document.documentElement, 'setAttribute', {
  value: mockSetAttribute
});
Object.defineProperty(document.documentElement, 'removeAttribute', {
  value: mockRemoveAttribute
});

// Reset mocks before each test
beforeEach(() => {
  mockSetAttribute.mockClear();
  mockRemoveAttribute.mockClear();
  localStorageMock.clear();
});