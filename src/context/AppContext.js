import { createContext, useContext, useState } from "react";

// 1️⃣ Create a new context
const AppContext = createContext(null);

// 2️⃣ Create the provider component
export const AppProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [customer, setCustomer] = useState(() => {
        const savedCustomer = localStorage.getItem('customer');
        return savedCustomer ? JSON.parse(savedCustomer) : null;
    });
    const [theme, setTheme] = useState(() => (localStorage.getItem('theme') || 'light'));
    const [currencyDataCtx, setCurrencyDataCtx] = useState([]);
    const [assetCtx, setAssetCtx] = useState([]);


    const updateTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const login = (newToken, newCustomer) => {
        setToken(newToken);
        setCustomer(newCustomer);
        localStorage.setItem('token', newToken);
        localStorage.setItem('customer', JSON.stringify(newCustomer));
    };

    const logout = () => {
        setToken(null);
        setCustomer(null);
        localStorage.removeItem('token');
        localStorage.removeItem('customer');
    };

    return (
        <AppContext.Provider value={{ token, setToken, customer, login, logout, theme, setTheme: updateTheme, currencyDataCtx, setCurrencyDataCtx, assetCtx, setAssetCtx }}>
            {children}
        </AppContext.Provider>
    );
};

// 3️⃣ Create a custom hook for safe access
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};

export default AppContext;
