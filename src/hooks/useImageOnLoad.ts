/**
 * @description Hook that styles loading images.
 * @author John C. Scott
 * @copyright 2022 John C. Scott, Scott Communications
 * @license https://opensource.org/licenses/MIT MIT
 * @see {@link https://usehooks-ts.com/react-hook/use-image-on-load}
 *
 * @requires     NPM:react.CSSProperties
 * @requires     NPM:react.useState
 *
 * @module useImageOnLoad
 */
import { useCallback, useState } from 'react';

interface ImageOnLoadResult {
  isLoaded: boolean;
  isError: boolean;
  handleImageOnLoad: () => void;
  handleImageError: () => void;
  wrapperProps: {
    'data-loaded': 'true' | 'false';
    'data-error': 'true' | 'false';
  };
}

const useImageOnLoad = (): ImageOnLoadResult => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handleImageOnLoad = useCallback((): void => {
    setIsLoaded(true);
  }, []);

  const handleImageError = useCallback((): void => {
    setIsError(true);
  }, []);

  return {
    isLoaded,
    isError,
    handleImageOnLoad,
    handleImageError,
    wrapperProps: {
      'data-loaded': isLoaded ? 'true' : 'false',
      'data-error': isError ? 'true' : 'false',
    },
  };
};

export default useImageOnLoad;
