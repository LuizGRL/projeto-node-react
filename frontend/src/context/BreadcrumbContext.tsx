import React, { createContext, useContext, useState, useEffect, useCallback } from "react"; // Adicione useCallback
import { useLocation } from "react-router-dom";

type BreadcrumbMap = Record<string, string>;

interface BreadcrumbContextType {
  setPathTitle: (path: string, title: string) => void;
  titles: BreadcrumbMap;
}

export const BreadcrumbContext = createContext<BreadcrumbContextType>({} as any);

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
  const [titles, setTitles] = useState<BreadcrumbMap>({});
  
  const setPathTitle = useCallback((path: string, title: string) => {
    setTitles((prev) => {
      if (prev[path] === title) return prev; 
      
      return { ...prev, [path]: title };
    });
  }, []);

  return (
    <BreadcrumbContext.Provider value={{ setPathTitle, titles }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const usePageTitle = (title: string) => {
  const { setPathTitle } = useContext(BreadcrumbContext);
  const location = useLocation();

  useEffect(() => {
    setPathTitle(location.pathname, title);
  }, [location.pathname, title, setPathTitle]);
};