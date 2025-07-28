import React, { createContext, useState, useContext } from 'react';

const ContestContext = createContext();

export const ContestProvider = ({ children }) => {
  const [hasCompleted, setHasCompleted] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [contest, setContest] = useState(null);

  return (
    <ContestContext.Provider
      value={{
        hasCompleted,
        setHasCompleted,
        hasEntered,
        setHasEntered,
        contest,
        setContest,
      }}
    >
      {children}
    </ContestContext.Provider>
  );
};

export const useContest = () => useContext(ContestContext);
