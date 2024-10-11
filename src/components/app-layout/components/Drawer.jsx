import { createContext, useContext, useState } from 'react';

const DrawerContext = createContext();

export const useDrawer = () => useContext(DrawerContext);

export const DrawerProvider = ({ children }) => {
    const [open, setOpen] = useState(true);

    const handleDrawerOpen = () => {
        setOpen(!open);
    };

    return (
        <DrawerContext.Provider value={{ open, handleDrawerOpen }}>
            {children}
        </DrawerContext.Provider>
    );
};
