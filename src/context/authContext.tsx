import { createContext, useContext, type ReactNode } from 'react';
import type { UserSession } from '@/lib/types';

export const AuthContext = createContext<UserSession | undefined>(undefined);

export const AuthProvider = ({ children, user }: { children: ReactNode, user: UserSession | undefined }) => {
    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para facilitar o consumo
export const useAuth = () => {
    const context = useContext(AuthContext);
    return context; // Retornará o user ou undefined se não estiver logado
};