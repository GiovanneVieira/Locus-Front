import { create } from 'zustand';

interface AuthStore {
    isOpen: boolean;
    authSignal: boolean;
    setOpen: (status: boolean) => void;
    setAuthSignal: (status: boolean) => void;
    handleAuthSuccess: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    isOpen: false,
    // O sinal nasce TRUE se o storage diz que você estava logado
    // OU se você acabou de chegar do redirecionamento do Google
    authSignal: typeof window !== 'undefined' && 
        (localStorage.getItem('auth_signal') === 'true' || document.referrer.includes('google.com')),
    
    setOpen: (status) => set({ isOpen: status }),
    setAuthSignal: (status) => {
        localStorage.setItem('auth_signal', status.toString());
        set({ authSignal: status });
    },
    handleAuthSuccess: () => {
        localStorage.setItem('auth_signal', 'true');
        set({ isOpen: false, authSignal: true });
    },
}));