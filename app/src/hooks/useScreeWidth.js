import { useState, useEffect } from 'react';
/**
 *  This hooks will return a boolean state that will be true if screen width is less than assigned value else false
 * @param {number} ScreenWidthLimit - Limit of the screen width in pixel.
 *
 */

const useScreenWidth = (ScreenWidthLimit) => {
  const [isLessThanLimit, setisLessThanLimit] = useState(
    () => window.innerWidth < ScreenWidthLimit
  );

  useEffect(() => {
    const handleResize = () => {
      setisLessThanLimit(() => {
        return window.innerWidth < ScreenWidthLimit;
      });
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isLessThanLimit;
};

export default useScreenWidth;
