import { createContext, useContext, useState } from "react";

const LoadingContext = createContext(false);

export const LoadingProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);

  const startGloablLoading = () => {
    setGlobalLoading(true);
  };

  const stopGlobalLoading = () => {
    setGlobalLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{ globalLoading, startGloablLoading, stopGlobalLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  return useContext(LoadingContext);
};
