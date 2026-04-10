import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import AuthPage from './auth/AuthPage';
import { Button } from './ui/button';
import { Drawer, DrawerTrigger, DrawerContent } from './ui/drawer';
import { useAuthStore } from '@/stores/useAuthStore';
import { X } from 'lucide-react';

interface appDialogProps {
    isMobile: boolean;
}

const AppDialog = ({ isMobile }: appDialogProps) => {
    const { isOpen, setOpen } = useAuthStore();

    return isMobile ? (
        <Drawer
            open={isOpen}
            onOpenChange={setOpen}>
            <DrawerTrigger>Login</DrawerTrigger>
            <DrawerContent className="fixed bottom-0 left-0 right-0 flex flex-col h-dvh">
                <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-muted my-4 cursor-grab active:cursor-grabbing" />
                <div className="flex-1 overflow-y-auto px-4 pb-10">
                    <AuthPage />
                </div>
            </DrawerContent>
        </Drawer>
    ) : (
        <div>
            <Dialog
                open={isOpen}
                onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="rounded-full border-white/15 bg-white/5 px-5 text-foreground hover:bg-white/10">
                        Entrar
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-112.5 p-0 border-none rounded-4xl shadow-none outline-none focus:ring-0 focus:ring-offset-0" showCloseButton={false}>
                    <DialogTitle className="sr-only">
                        Autenticação
                    </DialogTitle>
                    <div className="relative overflow-hidden rounded-3xl isolate">
                        <AuthPage />
                    </div>
                    <DialogClose className='absolute top-4 right-4 cursor-pointer hover:transform-[scale(1.1)] transition-all duration-300 text-primary'><X size={24}/></DialogClose>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AppDialog;
