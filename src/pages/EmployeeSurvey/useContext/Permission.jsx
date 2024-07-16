// AppContext.js
import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [surveyPermission, setSurveyPermission] = useState(false);

  return (
    <AppContext.Provider value={{ surveyPermission, setSurveyPermission }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
