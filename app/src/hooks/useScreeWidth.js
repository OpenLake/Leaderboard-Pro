import { useState, useEffect } from 'react';
/**
 *  This hooks will return a boolean state that will be tru
 */
const useScreenWidth = (ScreenWidthLimit) => {
  const [isLessThanLimit,setisLessThanLimit] = useState(()=>window.innerWidth < ScreenWidthLimit);

  useEffect(() => {
    const handleResize = () => {
      setisLessThanLimit(()=>{
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