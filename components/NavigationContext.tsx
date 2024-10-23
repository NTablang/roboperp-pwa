import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

type NavigationContextType = {
  stack: string[];
  pushRoute: (route: string) => void;
  popRoute: () => void;
  isTransitioning: boolean;
  triggerTransition: (route: string) => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setStack([router.asPath]);
  }, []);

  const pushRoute = (route: string) => {
    setStack((prevStack) => [...prevStack, route]);
    router.push(route);
  };

  const popRoute = () => {
    if (stack.length > 1) {
      const newStack = [...stack];
      newStack.pop();
      setStack(newStack);
      router.back();
    }
  };

  const triggerTransition = (route: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      pushRoute(route);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // Match this with the animation duration
    }, 300); // Match this with the animation duration
  };

  return (
    <NavigationContext.Provider value={{ stack, pushRoute, popRoute, isTransitioning, triggerTransition }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
