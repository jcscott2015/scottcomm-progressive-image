/**
 * @description Component that styles a progressively loading image.
 * @author John C. Scott
 * @copyright 2022 John C. Scott, Scott Communications
 * @license https://opensource.org/licenses/MIT MIT
 * @see {@link https://github.com/juliencrn/react-gallery/}
 *
 * @requires     NPM:react.CSSProperties
 * @requires     hooks/useImageOnLoad
 * @requires     ../no-image/NoImage
 *
 * @module ProgressiveImage
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties, type SyntheticEvent } from 'react';
import useImageOnLoad from './hooks/useImageOnLoad';
import NoImage from './NoImage';
import './ProgressiveImage.css';
import useIntersectionObserver from './hooks/useIntersectionObserver';

export interface ProgressiveImageProps {
  alt?: string;
  className?: string;
  fullSrc?: string;
  fullStyle?: CSSProperties;
  thumbSrc?: string;
  thumbStyle?: CSSProperties;
  title?: string;
}

const ProgressiveImage = (props: ProgressiveImageProps) => {
  const { fullSrc, fullStyle, thumbSrc, thumbStyle, alt, className } = props;
  const { handleImageOnLoad, handleImageError, isError, wrapperProps } = useImageOnLoad();
  // Track thumbnail errors locally so a missing thumb only hides itself.
  const [thumbErrored, setThumbErrored] = useState(false);

  const [loadedQuickly, setLoadedQuickly] = useState(false);
  const loadStartTime = useRef<number>(0);

  useEffect(() => {
    loadStartTime.current = Date.now();
  }, [fullSrc]);

  const containerRef = useRef<HTMLDivElement>(null);

  const isVisible = useIntersectionObserver(containerRef, {
    threshold: 0,
    root: null,
    rootMargin: '100px',
    freezeOnceVisible: true,
  });

  const isDataLoading = fullSrc === undefined;

  const isExplicitlyEmpty = fullSrc === null || (typeof fullSrc === 'string' && fullSrc.trim() === '');

  const showFallback = isExplicitlyEmpty || isError;

  const handleFullLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      const loadTime = Date.now() - loadStartTime.current;
      if (loadTime < 100) {
        setLoadedQuickly(true);
      }
      const img = e.currentTarget;
      if (typeof img.decode === 'function') {
        img.decode().then(handleImageOnLoad).catch(handleImageOnLoad);
      } else {
        handleImageOnLoad();
      }
    },
    [handleImageOnLoad]
  );

  return (
    <div
      ref={containerRef}
      className={className ? ['progressive-image', className].join(' ') : 'progressive-image'}
      {...wrapperProps}
      data-visible={isVisible}
    >
      {showFallback ? (
        <NoImage />
      ) : (
        !isDataLoading &&
        isVisible && (
          <>
            {thumbSrc && !thumbErrored && !loadedQuickly && (
              <img
                alt=""
                aria-hidden="true"
                className="img-thumb"
                onError={() => setThumbErrored(true)}
                src={thumbSrc}
                style={thumbStyle}
                data-testid="thumb-image"
              />
            )}

            <img
              alt={alt}
              className="img-full"
              decoding="async"
              onError={handleImageError}
              onLoad={handleFullLoad}
              src={fullSrc}
              style={fullStyle}
              data-testid="full-image"
            />
          </>
        )
      )}
    </div>
  );
};

export default ProgressiveImage;
