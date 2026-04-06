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
import {toast} from 'sonner'
import { Spinner } from './ui/spinner';
import { User } from 'lucide-react';

export function AvatarDropdown() {
    const currentUser = useAuth();
    const navigate = useNavigate();
    const { mutateAsync, isPending, isSuccess } = useLogout();

    const handleLogout = async () => {
        try {
            await mutateAsync();
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    };

    isSuccess && toast("Logged out succesfully", {position: 'top-right', duration: 1000})

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
                        <AvatarFallback><User/></AvatarFallback>
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
