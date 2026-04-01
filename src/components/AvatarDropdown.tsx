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
import { Spinner } from './ui/spinner';
import { queryClient } from '@/lib/queryClient';

export function AvatarDropdown() {
    const currentUser = useAuth();
    const navigate = useNavigate();
    const { mutateAsync, isPending } = useLogout();
    const handleLogout = async () => {
        try {
            await mutateAsync();

            queryClient.clear();

            window.location.href = '/';
        } catch (error) {
            console.error('Erro no logout:', error);
            window.location.href = '/';
        }
    };

    if (!currentUser) return null;

    {
        isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full">
                <Spinner className="size-4" />
            </div>
        );
    }

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
                        <AvatarFallback>CN</AvatarFallback>
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
