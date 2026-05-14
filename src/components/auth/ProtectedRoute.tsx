import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { Loader2 } from 'lucide-react';
import { ApiError } from '@/lib/api';
import { useCurrentUser } from '@/hooks/useAuth';
import type { UserRole } from '@/lib/types';
import { isHost } from '@/lib/user';

interface ProtectedRouteProps {
    children: ReactNode;
    requireRoles?: Array<UserRole | string>;
    requireHost?: boolean;
}

export function ProtectedRoute({
    children,
    requireRoles,
    requireHost: requireHostFlag = false,
}: ProtectedRouteProps) {
    const location = useLocation();

    const {
        data: user,
        isPending,
        isError,
        error,
    } = useCurrentUser();

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
                <Loader2 className="size-6 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        const redirect = encodeURIComponent(
            `${location.pathname}${location.search}`,
        );
        return (
            <Navigate
                to={`/auth?next=${redirect}`}
                replace
            />
        );
    }

    if (isError) {
        const isAuthError =
            error instanceof ApiError &&
            (error.status === 401 || error.status === 403);
        if (isAuthError) {
            const redirect = encodeURIComponent(
                `${location.pathname}${location.search}`,
            );
            return (
                <Navigate
                    to={`/auth?next=${redirect}`}
                    replace
                />
            );
        }
        return (
            <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
                <p className="text-sm text-muted-foreground">
                    Não foi possível validar sua sessão agora.
                </p>
            </div>
        );
    }

    if (
        requireRoles &&
        requireRoles.length > 0 &&
        !requireRoles.includes(user.role)
    ) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    if (requireHostFlag && !isHost(user)) {
        return (
            <Navigate
                to="/tornar-anfitriao"
                replace
            />
        );
    }

    return <>{children}</>;
}

export default ProtectedRoute;
import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router"
import { Loader2 } from "lucide-react"

import { useCurrentUser } from "@/hooks/useAuth"
import type { UserRole } from "@/lib/types"
import { isHost } from "@/lib/user"

interface ProtectedRouteProps {
  children: ReactNode
  requireRoles?: Array<UserRole | string>
  requireHost?: boolean
}

export function ProtectedRoute({
  children,
  requireRoles,
  requireHost: requireHostFlag = false,
}: ProtectedRouteProps) {
  const location = useLocation()
  const { data: user, isPending, isError } = useCurrentUser()

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/auth?next=${redirect}`} replace />
  }

  if (requireRoles && requireRoles.length > 0 && !requireRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  if (requireHostFlag && !isHost(user)) {
    return <Navigate to="/tornar-anfitriao" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
