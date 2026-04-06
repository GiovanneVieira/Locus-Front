import { useContext, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { navegacao } from '@/constants/constants';
import Logo from '@/components/LocusLogo';
import AuthPage from '@/components/auth/AuthPage';
import { NavItems } from '@/components/NavItems';
import { AvatarDropdown } from '../AvatarDropdown';
import AppNavbar from '../AppNavbar';
import { useAuth } from '@/context/authContext';

export default function Header() {
    const { theme, setTheme } = useTheme();
    const [menuAberto, setMenuAberto] = useState(false);
    const [authAberto, setAuthAberto] = useState(false);
    const currentUser = useAuth()
    const location = useLocation();
    const paginaAtual = useMemo(() => {
        const pagina = navegacao.find(
            (item) => item.rota === location.pathname,
        );
        return pagina?.nome ?? 'Locus';
    }, [location.pathname]);

    const isUserAdmin = (userRole: string | undefined) => {
        return userRole === 'admin';
    };

    const alternarTema = () =>
        setTheme(theme === 'dark' ? 'light' : 'dark');


    return (
        <header className="header-glow-line sticky top-0 z-50 w-full border-b border-white/10 bg-background/55 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
                <Link
                    to="/"
                    className="group flex min-w-0 items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="relative flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-transform duration-300 group-hover:scale-105">
                            <Logo className="size-8" />
                        </div>
                    </div>
                    <div className="min-w-0 leading-tight">
                        <strong className="block truncate text-base font-semibold text-foreground md:text-lg">
                            Locus
                        </strong>
                        <span className="block truncate text-xs text-muted-foreground md:text-sm">
                            {paginaAtual.toLowerCase()}
                        </span>
                    </div>
                </Link>

                <nav className="hidden items-center gap-2 lg:flex">
                    <AppNavbar
                        navegacao={navegacao}
                        userRole={currentUser?.role}></AppNavbar>
                </nav>

                <div className="hidden items-center gap-2 lg:flex">
                    <button
                        type="button"
                        onClick={alternarTema}
                        className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-all hover:bg-white/10"
                        aria-label="Alternar tema">
                        {theme === 'dark' ? (
                            <Sun size={18} />
                        ) : (
                            <Moon size={18} />
                        )}
                    </button>

                    {currentUser ? (
                        <AvatarDropdown/>
                    ) : (
                        <Dialog
                        onOpenChange={setAuthAberto}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="rounded-full border-white/15 bg-white/5 px-5 text-foreground hover:bg-white/10">
                                    Entrar
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="h-[95%] border-white/10 bg-transparent p-0 shadow-none sm:rounded-2xl rounded-3xl">
                                <DialogTitle className="sr-only">
                                    Autenticação
                                </DialogTitle>
                                <AuthPage />
                            </DialogContent>
                        </Dialog>
                    )}

                    {isUserAdmin(currentUser?.role) && (
                        <Button
                            asChild
                            className="rounded-full px-5 shadow-lg">
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center gap-2">
                                Painel Admin <ArrowRight size={16} />
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2 lg:hidden">
                    <button
                        onClick={() => setMenuAberto(!menuAberto)}
                        className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5"
                        aria-label="Abrir menu">
                        {menuAberto ? (
                            <X size={20} />
                        ) : (
                            <Menu size={20} />
                        )}
                    </button>
                </div>
            </div>

            <div
                className={`overflow-hidden border-t border-white/10 bg-background/80 backdrop-blur-2xl transition-all duration-300 lg:hidden ${
                    menuAberto
                        ? 'max-h-[500px] opacity-100'
                        : 'max-h-0 opacity-0'
                }`}>
                <div className="mx-auto max-w-7xl px-6 py-5">
                    <div className="mb-5 rounded-3xl border border-white/10 bg-white/5 p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                Navegação
                            </span>
                            <div className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
                                LOCUS v1.0
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <NavItems
                                onClick={() => setMenuAberto(false)}
                            />
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-full border-white/15">
                                <Link
                                    to="/auth"
                                    onClick={() =>
                                        setMenuAberto(false)
                                    }>
                                    Entrar na conta
                                </Link>
                            </Button>
                            <Button
                                asChild
                                className="rounded-full">
                                <Link
                                    to="/dashboard"
                                    onClick={() =>
                                        setMenuAberto(false)
                                    }
                                    className="flex items-center gap-2">
                                    Abrir dashboard{' '}
                                    <ArrowRight size={16} />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
