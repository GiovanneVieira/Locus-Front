import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/authContext';
import { useLogout } from '@/hooks/useAuth';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Spinner } from './ui/spinner';

import { User } from 'lucide-react';
export function AvatarDropdown() {
    const currentUser = useAuth();
    const navigate = useNavigate();
    const { mutateAsync, isPending } = useLogout();

    const handleLogout = async () => {
        const logoutPromise = mutateAsync();
        // O toast.promise gerencia o Spinner e as mensagens sozinho
        toast.promise(logoutPromise, {
            loading: (
                <div className="flex items-center gap-2">
                    Saindo... <Spinner className="size-4" />
                </div>
            ),
            success: 'Desconectado com sucesso!',
            error: 'Erro ao sair',
            position: 'top-right',
        });
        try {
            toast(
                <div className="flex">
                    Logging out... <Spinner />
                </div>,
                { position: 'top-right' },
            );
            await mutateAsync();
            toast('Logged out successfully', {
                position: 'top-right',
            });
            navigate('/');
        } catch (error) {
            console.error('Erro no logout:', error);
            toast.error('Error logging out', {
                position: 'top-right',
                duration: 1000,
            });
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full">
                    <Avatar>
                        <AvatarImage
                            src={currentUser?.pfpUrl}
                            alt="User profile"
                        />
                        <AvatarFallback>
                            <User />
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
                <DropdownMenuGroup>
                    <DropdownMenuItem>Perfil</DropdownMenuItem>
                    <DropdownMenuItem>Configurações</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={handleLogout}
                        disabled={isPending}>
                        {isPending ? 'Saindo...' : 'Log out'}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
