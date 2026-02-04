import React from 'react';

export default function Layout({ children, currentPageName }) {
  // Most pages handle their own layout (navigation, etc.)
  // This is a minimal wrapper
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
