
import React from 'react';

interface PageProps {
  title: string;
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ title, children }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      {children}
    </div>
  );
};

export default Page;
