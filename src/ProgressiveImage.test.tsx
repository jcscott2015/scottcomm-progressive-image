import { describe, expect, test, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProgressiveImage, { type ProgressiveImageProps } from './ProgressiveImage';

const triggerVisible = () => {
  act(() => {
    const mockEntries = [{ isIntersecting: true }] as IntersectionObserverEntry[];
    const dummyObserver = {} as IntersectionObserver;
    (
      globalThis as typeof globalThis & {
        IntersectionObserverMockInstance: { callback: IntersectionObserverCallback };
      }
    ).IntersectionObserverMockInstance.callback(mockEntries, dummyObserver);
  });
};

describe('ProgressiveImage', () => {
  const image: ProgressiveImageProps = {
    fullSrc: 'https://placeholder.com',
    thumbSrc: 'https://placeholder.com',
    alt: 'text alt',
  };

  test('does not render images before the wrapper is visible', () => {
    render(<ProgressiveImage {...image} />);
    expect(screen.queryByTestId('full-image')).toBeNull();
    expect(screen.queryByTestId('thumb-image')).toBeNull();
  });

  test('renders both images once visible', () => {
    render(<ProgressiveImage {...image} />);
    triggerVisible();
    expect(screen.getByTestId('full-image')).toHaveProperty('src', `${image.fullSrc}/`);
    expect(screen.getByTestId('thumb-image')).toHaveProperty('src', `${image.thumbSrc}/`);
  });

  test('renders NoImage when fullSrc is an empty string', () => {
    const { container } = render(<ProgressiveImage {...image} fullSrc="" />);
    triggerVisible();
    expect(screen.queryByTestId('full-image')).toBeNull();
    expect(container.querySelector('.noimage-wrapper')).not.toBeNull();
  });

  test('omitting fullSrc keeps the wrapper empty (data still loading)', () => {
    const { container } = render(<ProgressiveImage {...image} fullSrc={undefined} />);
    triggerVisible();
    expect(screen.queryByTestId('full-image')).toBeNull();
    expect(container.querySelector('.noimage-wrapper')).toBeNull();
  });

  test('falls back to NoImage when the full image errors', () => {
    const { container } = render(<ProgressiveImage {...image} />);
    triggerVisible();
    fireEvent.error(screen.getByTestId('full-image'));
    expect(screen.queryByTestId('full-image')).toBeNull();
    expect(container.querySelector('.noimage-wrapper')).not.toBeNull();
  });

  test('a thumbnail error hides only the thumb, leaving the full image intact', () => {
    const { container } = render(<ProgressiveImage {...image} />);
    triggerVisible();
    fireEvent.error(screen.getByTestId('thumb-image'));
    expect(screen.queryByTestId('thumb-image')).toBeNull();
    expect(screen.queryByTestId('full-image')).not.toBeNull();
    expect(container.querySelector('.noimage-wrapper')).toBeNull();
  });

  test('flips data-loaded to true after the full image decodes', async () => {
    const decode = vi.fn().mockResolvedValue(undefined);
    const originalDecode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = decode;

    try {
      const { container } = render(<ProgressiveImage {...image} />);
      triggerVisible();

      const wrapper = container.querySelector('.progressive-image') as HTMLElement;
      expect(wrapper.dataset.loaded).toBe('false');

      await act(async () => {
        fireEvent.load(screen.getByTestId('full-image'));
      });

      await waitFor(() => expect(wrapper.dataset.loaded).toBe('true'));
      expect(decode).toHaveBeenCalledTimes(1);
    } finally {
      HTMLImageElement.prototype.decode = originalDecode;
    }
  });

  test('still flips data-loaded when decode() rejects', async () => {
    const decode = vi.fn().mockRejectedValue(new Error('boom'));
    const originalDecode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = decode;

    try {
      const { container } = render(<ProgressiveImage {...image} />);
      triggerVisible();

      await act(async () => {
        fireEvent.load(screen.getByTestId('full-image'));
      });

      const wrapper = container.querySelector('.progressive-image') as HTMLElement;
      await waitFor(() => expect(wrapper.dataset.loaded).toBe('true'));
    } finally {
      HTMLImageElement.prototype.decode = originalDecode;
    }
  });

  test('renders only the full image when no thumbSrc is provided', () => {
    render(<ProgressiveImage fullSrc={image.fullSrc} alt={image.alt} />);
    triggerVisible();
    expect(screen.queryByTestId('full-image')).not.toBeNull();
    expect(screen.queryByTestId('thumb-image')).toBeNull();
  });

  test('applies the supplied className to the wrapper', () => {
    const { container } = render(<ProgressiveImage {...image} className="custom-class" />);
    const wrapper = container.querySelector('.progressive-image');
    expect(wrapper?.className).toContain('custom-class');
  });
});
