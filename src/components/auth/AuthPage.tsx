import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { Button } from '../ui/button';
import { Link, useParams } from 'react-router';
import { X } from 'lucide-react';
import LocusLogo from '../LocusLogo';

const AuthPage = () => {
    const [currentCard, setCurrentCard] = useState<'login' | 'register'>('login');
    const { context } = useParams();
    
    // Define para onde voltar ao fechar (contexto ou home)
    const backPath = context ? `/${context}` : '/';

    return (
        <div className="outline-2 bg-background text-foreground overflow-hidden relative flex items-center justify-center">
            {/* Background Orbs & Pattern */}
            <div className="pointer-events-none absolute inset-0">
                <div className="hero-orb top-[10%] left-[-10%] opacity-60" />
                <div className="hero-orb-secondary bottom-[10%] right-[-5%] opacity-50" />
                <div className="grid-pattern absolute inset-0 opacity-20" />
            </div>

            {/* Main Auth Card */}
            <div className="glass-card relative p-8 md:p-10 flex flex-col gap-8 shadow-none! w-full rounded-none! border-none! h-full hover:transform-[translate(0)]!">
                
                {/* Header: Logo & Toggle */}
                <div className="flex flex-col items-center gap-6">
                    <Link to="/" className="hover:scale-105 transition-transform">
                        <LocusLogo className="size-10" />
                    </Link>
                    
                    <div className="w-full flex flex-col items-center gap-2">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {currentCard === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {currentCard === 'login' ? 'Acesse sua inteligência de viagem' : 'Comece sua jornada premium no Locus'}
                        </p>
                    </div>

                    {/* Segmented Control Switcher */}
                    <div className="flex w-full p-1 bg-white/5 border border-white/10 rounded-2xl">
                        <button
                            onClick={() => setCurrentCard('login')}
                            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                                currentCard === 'login' 
                                ? 'bg-primary text-primary-foreground shadow-lg' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Entre
                        </button>
                        <button
                            onClick={() => setCurrentCard('register')}
                            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                                currentCard === 'register' 
                                ? 'bg-primary text-primary-foreground shadow-lg' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Cadastre-se
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="relative min-h-[300px]">
                   {currentCard === 'login' ? <Login /> : <Register />}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;