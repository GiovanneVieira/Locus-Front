import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import {
    fetchCurrentUser,
    login,
    logout,
    preRegister,
} from '@/lib/api';
import type { AuthPayload, RegisterPayload } from '@/lib/types';

export const authKeys = {
    currentUser: ['auth', 'current-user'] as const,
};

export function useCurrentUser() {
    return useQuery({
        queryKey: authKeys.currentUser,
        queryFn: fetchCurrentUser,
    });
}

export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: AuthPayload) => login(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: authKeys.currentUser,
            });
            await queryClient.invalidateQueries({
                queryKey: ['dashboard', 'board'],
            });
        },
    });
}

export function useRegister() {

    return useMutation({
        mutationFn: (payload: RegisterPayload) =>
            preRegister(payload),
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            queryClient.removeQueries({
                queryKey: authKeys.currentUser,
            });
            queryClient.removeQueries({
                queryKey: ['dashboard', 'board'],
            });
        },
    });
}
