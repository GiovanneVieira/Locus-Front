import { AuthProvider } from '@/context/authContext'
import { DashboardSkeleton } from '../skeleton/DashboardSkeleton';
import { useCurrentUser } from '@/hooks/useAuth';
export function AuthLoader({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading } = useCurrentUser();

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <AuthProvider user={user}>
            {children}
        </AuthProvider>
    );
}