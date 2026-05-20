import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    KeyRound,
    ArrowLeft,
    CheckCircle2,
    Loader2,
} from 'lucide-react';
import { useForm } from '@tanstack/react-form';

import GoogleLogo from '@/assets/google-logo.svg';
import { useLogin, useResetPassword } from '@/hooks/useAuth';
import { ApiError, getApiBaseUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/feedback/ToastProvider';
import type { ForgotPasswordDTO } from '@/lib/types';
import { useSendOtp, useValidateOtp } from '@/hooks/useOtp';

type LoginView =
    | 'login'
    | 'forgot-email'
    | 'forgot-otp'
    | 'reset-password';

const Login = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [searchParams] = useSearchParams();

    // Mutations do TanStack Query
    const loginMutation = useLogin();
    const resetPasswordMutation = useResetPassword();
    const validateOtp = useValidateOtp();
    const sendOtp = useSendOtp();

    // Estados de Controle de Telas e Visibilidade
    const [view, setView] = useState<LoginView>('login');
    const [hidePassword, setHidePassword] = useState(true);
    const [hideNewPassword, setHideNewPassword] = useState(true);
    const [hideConfirmPassword, setHideConfirmPassword] =
        useState(true);
    const [feedback, setFeedback] = useState<string | null>(null);

    // Dados temporários guardados ao longo do fluxo linear
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpToken, setOtpToken] = useState(''); // Se precisar guardar o token retornado pela validação do OTP para o passo final de reset (dependendo da implementação do backend)
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const next = searchParams.get('next') || '/';

    // Form de Login Nativo com TanStack Form
    const form = useForm({
        defaultValues: { email: '', password: '' },
        onSubmit: async ({ value }) => {
            setFeedback(null);
            try {
                await loginMutation.mutateAsync(value);
                toast.success('Login bem-sucedido!', 'Boas vindas novamente ao Locus...');
                navigate(next, { replace: true });
            } catch (error) {
                const message =
                    error instanceof ApiError
                        ? error.message
                        : 'Não foi possível autenticar agora.';
                setFeedback(message);
            }
        },
    });

    // PASSO 1: Solicitar envio do OTP para o e-mail
    async function handleSendRecoveryOtp(
        e: FormEvent<HTMLFormElement>,
    ) {
        e.preventDefault();
        if (!recoveryEmail.trim()) {
            setFeedback('Por favor, insira um e-mail válido.');
            return;
        }

        setFeedback(null);
        try {
            const sendOtpPayload = {
                email: recoveryEmail.trim(),
                username: recoveryEmail.trim(),
            };
            await sendOtp.mutateAsync(sendOtpPayload);
            toast.success(
                'Código enviado!',
                'Verifique sua caixa de entrada para obter o código de verificação.',
            );
            setView('forgot-otp');
        } catch (error) {
            const message =
                error instanceof ApiError
                    ? error.message
                    : 'Erro ao enviar o código.';
            setFeedback(message);
        }
    }

    // PASSO 2: Validação do OTP
    async function handleVerifyOtpOnly(
        e: FormEvent<HTMLFormElement>,
    ) {
        e.preventDefault();
        if (!otpCode.trim() || otpCode.trim().length < 6) {
            setFeedback('Insira o código de validação de 6 dígitos.');
            return;
        }

        try {
            const response = await validateOtp.mutateAsync({
                email: recoveryEmail.trim(),
                otpCode: otpCode.trim(),
            });
            setOtpToken(response.otpToken);
        } catch (error) {
            const message =
                error instanceof ApiError
                    ? error.message
                    : 'Erro ao validar o código.';
            setFeedback(message);
            return;
        }
        setFeedback(null);
        setView('reset-password');
    }

    // PASSO 3: Envio combinado e atômico para o endpoint 'forgotPassword' do Spring Boot
    async function handleConfirmNewPassword(
        e: FormEvent<HTMLFormElement>,
    ) {
        e.preventDefault();
        if (!newPassword.trim() || !confirmPassword.trim()) {
            setFeedback('Todos os campos são obrigatórios.');
            return;
        }
        if (newPassword.length < 8) {
            setFeedback(
                'A nova senha deve ter pelo menos 8 caracteres.',
            );
            return;
        }
        if (newPassword !== confirmPassword) {
            setFeedback('As senhas informadas não coincidem.');
            return;
        }

        setFeedback(null);
        try {
            const payload: ForgotPasswordDTO = {
                email: recoveryEmail.trim(),
                otpToken: otpToken.trim(),
                password: newPassword.trim(),
            };

            await resetPasswordMutation.mutateAsync(payload);

            toast.success(
                'Senha alterada!',
                'Sua credencial foi atualizada com sucesso.',
            );

            // Reseta tudo e volta pro Login limpo
            setRecoveryEmail('');
            setOtpCode('');
            setNewPassword('');
            setConfirmPassword('');
            setOtpToken('');
            setView('login');
        } catch (error) {
            const message =
                error instanceof ApiError
                    ? error.message
                    : 'Falha ao atualizar senha.';

            setFeedback(message);
        }
    }

    function handleGoogleLogin() {
        window.location.assign(
            `${getApiBaseUrl()}/oauth2/authorization/google`,
        );
    }

    function handleFacebookLogin() {
        window.location.assign(
            `${getApiBaseUrl()}/oauth2/authorization/facebook`,
        );
    }

    /* ========================================================
     VIEW 1: LOGIN TRADICIONAL
     ======================================================== */
    if (view === 'login') {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-6 duration-500">
                <form
                    className="flex flex-col gap-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.handleSubmit();
                    }}>
                    <form.Field name="email">
                        {(field) => (
                            <div className="space-y-2">
                                <div className="group relative">
                                    <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                    <Input
                                        value={field.state.value}
                                        onChange={(event) =>
                                            field.handleChange(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="E-mail"
                                        type="email"
                                        className="h-12 rounded-xl border-border bg-secondary/50 pl-10 transition-all focus:border-primary/50"
                                    />
                                </div>
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="password">
                        {(field) => (
                            <div className="space-y-1">
                                <div className="group relative">
                                    <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                    <Input
                                        value={field.state.value}
                                        onChange={(event) =>
                                            field.handleChange(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Sua senha"
                                        type={
                                            hidePassword
                                                ? 'password'
                                                : 'text'
                                        }
                                        className="h-12 rounded-xl border-border bg-secondary/50 pr-10 pl-10 transition-all focus:border-primary/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setHidePassword(
                                                !hidePassword,
                                            )
                                        }
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground">
                                        {hidePassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>

                                <div className="flex justify-end pt-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFeedback(null);
                                            setView('forgot-email');
                                        }}
                                        className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary">
                                        Esqueceu a senha?
                                    </button>
                                </div>
                            </div>
                        )}
                    </form.Field>

                    {feedback ? (
                        <p className="text-sm text-destructive">
                            {feedback}
                        </p>
                    ) : null}

                    <Button
                        type="submit"
                        className="h-12 w-full cursor-pointer rounded-xl font-semibold shadow-lg shadow-primary/20 gap-2"
                        disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? (
                            <>
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />
                                Entrando...
                            </>
                        ) : (
                            'Entrar agora'
                        )}
                    </Button>
                </form>

                <div className="relative flex items-center gap-4">
                    <Separator className="flex-1 bg-secondary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Ou continue com
                    </span>
                    <Separator className="flex-1 bg-secondary" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 cursor-pointer rounded-xl border-border bg-secondary/50 transition-all hover:bg-secondary"
                        onClick={handleGoogleLogin}>
                        <img
                            src={GoogleLogo}
                            alt="Google"
                            className="mr-2 w-4"
                        />
                        Google
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 cursor-pointer rounded-xl border-border bg-secondary/50 transition-all hover:bg-secondary"
                        onClick={handleFacebookLogin}>
                        <span className="mr-2 text-[1.25rem] font-bold text-blue-500">
                            f
                        </span>
                        Facebook
                    </Button>
                </div>
            </div>
        );
    }

    /* ========================================================
     VIEW 2: ENTRADA DO E-MAIL
     ======================================================== */
    if (view === 'forgot-email') {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-5 duration-500">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold tracking-tight">
                        Recuperar senha
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Insira o e-mail da sua conta para enviarmos um
                        código de verificação.
                    </p>
                </div>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSendRecoveryOtp}>
                    <div className="group relative">
                        <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input
                            value={recoveryEmail}
                            onChange={(e) =>
                                setRecoveryEmail(e.target.value)
                            }
                            placeholder="Digite seu e-mail cadastrado"
                            type="email"
                            required
                            className="h-12 rounded-xl border-border bg-secondary/50 pl-10 transition-all focus:border-primary/50"
                        />
                    </div>

                    {feedback ? (
                        <p className="text-sm text-destructive">
                            {feedback}
                        </p>
                    ) : null}

                    <div className="flex flex-col gap-2">
                        <Button
                            type="submit"
                            className="h-12 w-full font-semibold shadow-md rounded-xl cursor-pointer"
                            disabled={sendOtp.isPending}>
                            {sendOtp.isPending ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    <span>Enviando...</span>
                                </>
                            ) : (
                                'Enviar código de verificação'
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            className="h-10 text-xs gap-1.5 text-muted-foreground rounded-xl cursor-pointer"
                            onClick={() => {
                                setFeedback(null);
                                setView('login');
                            }}>
                            <ArrowLeft size={14} /> Voltar para o
                            login
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    /* ========================================================
     VIEW 3: INTRODUÇÃO DO OTP
     ======================================================== */
    if (view === 'forgot-otp') {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-5 duration-500">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold tracking-tight">
                        Verificação OTP
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Insira o código de 6 dígitos que enviamos para{' '}
                        <span className="font-semibold text-foreground">
                            {recoveryEmail}
                        </span>
                        .
                    </p>
                </div>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleVerifyOtpOnly}>
                    <div className="group relative">
                        <KeyRound className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input
                            value={otpCode}
                            onChange={(e) =>
                                setOtpCode(
                                    e.target.value
                                        .replace(/\D/g, '')
                                        .slice(0, 6),
                                )
                            }
                            placeholder="Código de 6 dígitos"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            required
                            className="h-12 rounded-xl border-border bg-secondary/50 pl-10 tracking-[0.25em] font-mono text-center text-lg transition-all focus:border-primary/50"
                        />
                    </div>

                    {feedback ? (
                        <p className="text-sm text-destructive">
                            {feedback}
                        </p>
                    ) : null}

                    <div className="flex flex-col gap-2">
                        <Button
                            type="submit"
                            className="h-12 w-full font-semibold shadow-md rounded-xl cursor-pointer"
                            disabled={validateOtp.isPending}>
                            {validateOtp.isPending ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />{' '}
                                    Verificando...
                                </>
                            ) : (
                                'Validar código'
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            className="h-10 text-xs gap-1.5 text-muted-foreground rounded-xl cursor-pointer"
                            onClick={() => {
                                setFeedback(null);
                                setView('forgot-email');
                            }}>
                            <ArrowLeft size={14} /> Corrigir e-mail
                            informado
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    /* ========================================================
     VIEW 4: DEFINIÇÃO DE NOVAS CREDENCIAIS (Passo Final)
     ======================================================== */
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-5 duration-500">
            <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-500">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                        Código validado
                    </span>
                </div>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">
                    Crie sua nova senha
                </h3>
                <p className="text-xs text-muted-foreground">
                    Escolha uma credencial forte de no mínimo 8
                    dígitos para o Locus.
                </p>
            </div>

            <form
                className="flex flex-col gap-4"
                onSubmit={handleConfirmNewPassword}>
                <div className="group relative">
                    <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(e.target.value)
                        }
                        placeholder="Nova senha"
                        type={hideNewPassword ? 'password' : 'text'}
                        required
                        className="h-12 rounded-xl border-border bg-secondary/50 pr-10 pl-10 transition-all focus:border-primary/50"
                    />
                    <button
                        type="button"
                        onClick={() =>
                            setHideNewPassword(!hideNewPassword)
                        }
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground">
                        {hideNewPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>

                <div className="group relative">
                    <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        placeholder="Confirme a nova senha"
                        type={
                            hideConfirmPassword ? 'password' : 'text'
                        }
                        required
                        className="h-12 rounded-xl border-border bg-secondary/50 pr-10 pl-10 transition-all focus:border-primary/50"
                    />
                    <button
                        type="button"
                        onClick={() =>
                            setHideConfirmPassword(
                                !hideConfirmPassword,
                            )
                        }
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground">
                        {hideConfirmPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>

                {feedback ? (
                    <p className="text-sm text-destructive">
                        {feedback}
                    </p>
                ) : null}

                <Button
                    type="submit"
                    className="h-12 w-full font-semibold shadow-md bg-primary text-primary-foreground rounded-xl cursor-pointer gap-2"
                    disabled={resetPasswordMutation.isPending}>
                    {resetPasswordMutation.isPending ? (
                        <>
                            <Loader2
                                size={16}
                                className="animate-spin"
                            />
                            Atualizando...
                        </>
                    ) : (
                        'Gravar nova senha'
                    )}
                </Button>
            </form>
        </div>
    );
};

export default Login;
