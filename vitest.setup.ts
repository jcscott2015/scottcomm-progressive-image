import { vi } from 'vitest';

declare global {
  var IntersectionObserverMockInstance: {
    callback: IntersectionObserverCallback;
  };
}

globalThis.IntersectionObserverMockInstance = {
  callback: (): void => {},
};

vi.stubGlobal(
  'IntersectionObserver',
  class implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin = '';
    readonly thresholds: readonly number[] = [];
    readonly scrollMargin = '';

    constructor(callback: IntersectionObserverCallback) {
      globalThis.IntersectionObserverMockInstance.callback = callback;
    }

    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
);
