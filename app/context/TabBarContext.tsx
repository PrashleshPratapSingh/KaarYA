import React, { createContext, useContext } from 'react';
import { useSharedValue, SharedValue } from 'react-native-reanimated';

interface TabBarContextType {
    scrollY: SharedValue<number>;
}

const TabBarContext = createContext<TabBarContextType | null>(null);

export const useTabBarContext = () => {
    const context = useContext(TabBarContext);
    if (!context) {
        throw new Error('useTabBarContext must be used within a TabBarProvider');
    }
    return context;
};

export const TabBarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const scrollY = useSharedValue(0);

    return (
        <TabBarContext.Provider value={{ scrollY }}>
            {children}
        </TabBarContext.Provider>
    );
};
