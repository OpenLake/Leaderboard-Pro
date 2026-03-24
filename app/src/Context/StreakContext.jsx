import { createContext, useState, useContext } from "react";

const StreakContext = createContext();

export const useStreak = () => {
  return useContext(StreakContext);
};

export const StreakProvider = ({ children }) => {
  const [streaks, setStreaks] = useState({
    codeforces: 0,
    github: 0,
  });

  const updateStreak = (platform, streak) => {
    setStreaks((prev) => ({
      ...prev,
      [platform]: streak,
    }));
  };

  return (
    <StreakContext.Provider value={{ streaks, updateStreak }}>
      {children}
    </StreakContext.Provider>
  );
};

export default StreakContext;
