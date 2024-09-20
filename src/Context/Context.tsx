import React, { createContext, useState, ReactNode } from 'react';

// Definiera typ för Context-värdet
type ContextType = {
};

// Skapa Context
const MyContext = createContext<ContextType | undefined>(undefined);

// Skapa en provider-komponent
function MyContextProvider({ children }: { children: ReactNode }) {

  return (
    <MyContext.Provider value={{  }}>
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };