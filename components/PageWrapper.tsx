import React from 'react';
import { useRouter } from 'next/router';
import { useNavigation } from './NavigationContext';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { stack } = useNavigation();

  const isActive = stack[stack.length - 1] === router.asPath;

  return (
    <div style={{ display: isActive ? 'block' : 'none' }}>
      {children}
    </div>
  );
};

export default PageWrapper;
