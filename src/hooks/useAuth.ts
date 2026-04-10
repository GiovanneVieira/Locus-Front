import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { fetchCurrentUser, login, logout, register } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';

// 1. Chave centralizada para evitar erros de digitação
export const authKeys = {
    currentUser: ['auth', 'current-user'] as const,
};

export function useCurrentUser() {
    const authSignal = useAuthStore((s) => s.authSignal);

    return useQuery({
        queryKey: authKeys.currentUser,
        queryFn: fetchCurrentUser,
        enabled: authSignal, 
        retry: 2,
        staleTime: 1000 * 60 * 5,
    });
}

export function useLogin() {
    const queryClient = useQueryClient();
    const handleAuthSuccess = useAuthStore(
        (s) => s.handleAuthSuccess,
    );

    return useMutation({
        mutationFn: login,
        onSuccess: (userData) => {
            // A ordem aqui importa:
            // 1. Injetamos o dado no cache para o Header "acordar" com os dados prontos
            queryClient.setQueryData(authKeys.currentUser, userData);

            // 2. Ativamos o sinal e fechamos o modal via Store
            handleAuthSuccess();

            // 3. Forçamos uma re-sincronização por segurança
            queryClient.invalidateQueries({
                queryKey: authKeys.currentUser,
            });
        },
    });
}

export function useRegister() {
    const queryClient = useQueryClient();
    const handleAuthSuccess = useAuthStore(
        (s) => s.handleAuthSuccess,
    );

    return useMutation({
        mutationFn: register,
        onSuccess: (userData) => {
            queryClient.setQueryData(authKeys.currentUser, userData);
            handleAuthSuccess();
            queryClient.invalidateQueries({
                queryKey: authKeys.currentUser,
            });
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    const setAuthSignal = useAuthStore((s) => s.setAuthSignal);

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            // 1. Desliga o sinal na store e no localStorage
            setAuthSignal(false);

            // 2. Limpa o cache imediatamente para o Avatar sumir
            queryClient.setQueryData(authKeys.currentUser, null);
            queryClient.removeQueries({
                queryKey: authKeys.currentUser,
            });
            queryClient.clear(); // Limpa tudo por segurança no logout
        },
    });
}
