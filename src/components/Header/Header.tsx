import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useMedia } from 'react-use';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { navegacao } from '@/constants/constants';
import Logo from '@/components/LocusLogo';
import { NavItems } from '@/components/NavItems';
import { AvatarDropdown } from '../AvatarDropdown';
import AppNavbar from '../AppNavbar';
import AppDialog from '../AppDialog';
import { useCurrentUser } from '@/hooks/useAuth';

export default function Header() {
    const { theme, setTheme } = useTheme();
    const [menuAberto, setMenuAberto] = useState(false);
    
    const { data: currentUser } = useCurrentUser();
    
    console.log(`Current user ${currentUser?.name}`)
    
    const location = useLocation();
    const isMobile = useMedia('(max-width:1024px)');

    const paginaAtual = useMemo(() => {
        const pagina = navegacao.find((item) => item.rota === location.pathname);
        return pagina?.nome ?? 'Locus';
    }, [location.pathname]);

    const isUserAdmin = (userRole: string | undefined) => userRole === 'admin';

    const alternarTema = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    return (
        <header className="header-glow-line sticky top-0 z-50 w-full border-b border-white/10 bg-background/55 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
                {/* Logo e Nome (Mantido) */}
                <Link to="/" className="group flex min-w-0 items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="relative flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-transform duration-300 group-hover:scale-105">
                            <Logo className="size-8" />
                        </div>
                    </div>
                    <div className="min-w-0 leading-tight">
                        <strong className="block truncate text-base font-semibold text-foreground md:text-lg">Locus</strong>
                        <span className="block truncate text-xs text-muted-foreground md:text-sm">{paginaAtual.toLowerCase()}</span>
                    </div>
                </Link>

                {/* Navbar Desktop */}
                <nav className="hidden items-center gap-2 lg:flex">
                    <AppNavbar navegacao={navegacao} userRole={currentUser?.role} />
                </nav>

                <div className="hidden items-center gap-3 lg:flex ">
                    <button onClick={alternarTema} className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-all hover:bg-white/10">
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* LÓGICA DE LOGIN: Reage à Query do TanStack */}
                    {currentUser ? (
                        <AvatarDropdown />
                    ) : (
                        <AppDialog isMobile={isMobile} />
                    )}

                    {isUserAdmin(currentUser?.role) && (
                        <Button asChild className="rounded-full px-5 shadow-lg">
                            <Link to="/dashboard" className="inline-flex items-center gap-2">
                                Painel Admin <ArrowRight size={16} />
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2 lg:hidden">
                    <button onClick={() => setMenuAberto(!menuAberto)} className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5">
                        {menuAberto ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            <div className={`overflow-hidden border-t border-white/10 bg-background/80 backdrop-blur-2xl transition-all duration-300 lg:hidden ${menuAberto ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="mx-auto max-w-7xl px-6 py-5">
                    <div className="mb-5 rounded-3xl border border-white/10 bg-white/5 p-4">
                        <div className="grid gap-2">
                            <NavItems onClick={() => setMenuAberto(false)} />
                        </div>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {currentUser ? (
                                <AvatarDropdown />
                            ) : (
                                <AppDialog isMobile={isMobile} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}