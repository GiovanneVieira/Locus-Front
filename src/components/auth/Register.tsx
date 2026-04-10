import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useForm } from '@tanstack/react-form';
import {
    ArrowRight,
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
} from 'lucide-react';

import GoogleLogo from '@/assets/google-logo.svg';
import { ApiError, getApiBaseUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useRegister } from '@/hooks/useAuth';

const Register = () => {
    const registerMutation = useRegister();
    const [showPassword, setShowPassword] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        onSubmit: async ({ value }) => {
            if (value.password !== value.confirmPassword) {
                setFeedback('As senhas não conferem.');
                return;
            }

            setFeedback(null);
            try {
                // O useRegister faz o "trabalho sujo" no onSuccess
                await registerMutation.mutateAsync({
                    name: value.name,
                    email: value.email,
                    password: value.password,
                });
                
                toast.success('Conta criada com sucesso!');
            } catch (error) {
                const message = error instanceof ApiError
                    ? error.message
                    : 'Não foi possível concluir o cadastro.';
                setFeedback(message);
            }
        },
    });

    function handleGoogleRegister() {
        window.location.assign(
            `${getApiBaseUrl()}/oauth2/authorization/google`,
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-6 duration-500">
            <form
                className="flex flex-col gap-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    form.handleSubmit();
                }}>
                <form.Field name="name">
                    {(field) => (
                        <div className="group relative">
                            <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input
                                value={field.state.value}
                                onChange={(event) =>
                                    field.handleChange(
                                        event.target.value,
                                    )
                                }
                                placeholder="Digite seu nome completo"
                                className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 transition-all focus:border-primary/50"
                            />
                        </div>
                    )}
                </form.Field>

                <form.Field name="email">
                    {(field) => (
                        <div className="group relative">
                            <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input
                                value={field.state.value}
                                onChange={(event) =>
                                    field.handleChange(
                                        event.target.value,
                                    )
                                }
                                type="email"
                                placeholder="Digite seu e-mail"
                                className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 transition-all focus:border-primary/50"
                            />
                        </div>
                    )}
                </form.Field>

                <form.Field name="password">
                    {(field) => (
                        <div className="group relative">
                            <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input
                                value={field.state.value}
                                onChange={(event) =>
                                    field.handleChange(
                                        event.target.value,
                                    )
                                }
                                type={
                                    showPassword ? 'text' : 'password'
                                }
                                placeholder="Crie uma senha forte"
                                className="h-12 rounded-xl border-white/10 bg-white/5 pr-10 pl-10 transition-all focus:border-primary/50"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                aria-label={
                                    showPassword
                                        ? 'Ocultar senha'
                                        : 'Mostrar senha'
                                }>
                                {showPassword ? (
                                    <Eye size={18} />
                                ) : (
                                    <EyeOff size={18} />
                                )}
                            </button>
                        </div>
                    )}
                </form.Field>

                <form.Field name="confirmPassword">
                    {(field) => (
                        <div className="group relative">
                            <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input
                                value={field.state.value}
                                onChange={(event) =>
                                    field.handleChange(
                                        event.target.value,
                                    )
                                }
                                type={
                                    showPassword ? 'text' : 'password'
                                }
                                placeholder="Confirme sua senha"
                                className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 transition-all focus:border-primary/50"
                            />
                        </div>
                    )}
                </form.Field>

                {feedback ? (
                    <p className="text-sm text-destructive">
                        {feedback}
                    </p>
                ) : null}

                <p className="px-1 text-[10px] leading-relaxed text-muted-foreground">
                    Ao se cadastrar, você concorda com nossos Termos
                    de Serviço e Política de Privacidade.
                </p>

                <Button
                    type="submit"
                    className="h-12 w-full cursor-pointer rounded-xl font-semibold shadow-lg shadow-primary/20"
                    disabled={registerMutation.isPending}>
                    {registerMutation.isPending
                        ? 'Criando conta...'
                        : 'Criar conta'}
                    <ArrowRight
                        size={16}
                        className="ml-2"
                    />
                </Button>
            </form>

            <div className="relative flex items-center gap-4">
                <Separator className="flex-1 bg-white/10" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Ou cadastre-se com
                </span>
                <Separator className="flex-1 bg-white/10" />
            </div>

            <Button
                type="button"
                variant="outline"
                className="h-11 w-full cursor-pointer rounded-xl border-white/10 bg-white/5 transition-all hover:bg-white/10"
                onClick={handleGoogleRegister}>
                <img
                    src={GoogleLogo}
                    alt="Google"
                    className="mr-2 w-4"
                />
                Continuar com Google
            </Button>
        </div>
    );
};

export default Register;
