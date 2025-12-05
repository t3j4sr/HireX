import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    name: string;
    email: string;
    picture: string;
    isGuest?: boolean;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    loginAsGuest: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check localStorage on mount
        const storedUser = localStorage.getItem('hirex_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('hirex_user', JSON.stringify(userData));
    };

    const loginAsGuest = () => {
        const guestUser: User = {
            name: "Guest User",
            email: "guest@hirex.local",
            picture: "",
            isGuest: true
        };
        setUser(guestUser);
        localStorage.setItem('hirex_user', JSON.stringify(guestUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('hirex_user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginAsGuest, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
