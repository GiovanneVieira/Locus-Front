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
import { useCurrentUser, useLogout } from '@/hooks/useAuth';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { User } from 'lucide-react';
import { ToastCard } from './ToastCard';
import { useAuthStore } from '@/stores/useAuthStore';
export function AvatarDropdown() {
    const { data: user } = useCurrentUser();
    const navigate = useNavigate();
    const { mutateAsync, isPending } = useLogout();
    const setOpen = useAuthStore(s => s.setOpen)

    const handleLogout = async () => {
        const logoutPromise = mutateAsync();
        // O toast.promise gerencia o Spinner e as mensagens sozinho
        toast.promise(logoutPromise, {
            loading: <ToastCard text="Saindo..." />,
            success: () => {
                return (
                    <ToastCard
                        text="Desconectado com sucesso!"
                        isSuccess={true}
                    />
                );
            },
            error: (error) => {
                console.error(`Error logging out: ${error}`);
                return (
                    <ToastCard
                        text="Erro ao sair"
                        isError={true}
                    />
                );
            },
            className: 'border-2 border-primary bg-foreground!', // Estilo do balão externo
            duration: 1000,
        });
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
                            src={user?.pfpUrl}
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
