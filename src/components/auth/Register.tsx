import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { useForm } from "@tanstack/react-form"
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, RefreshCw } from "lucide-react"

import GoogleLogo from "@/assets/google-logo.svg"
import { useLogin, useRegister } from "@/hooks/useAuth"
// Importação com os nomes exatos do seu arquivo useOtp.ts
import { useSendOtp, useValidateOtp } from "@/hooks/useOtp"
import { ApiError, getApiBaseUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useEnableUser } from "@/hooks/useUser"

const Register = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Hook do useUser.ts
  const enableUserMutation = useEnableUser()

  // Hook do useAuth.ts
  const registerMutation = useRegister()
  const loginMutation = useLogin()

  // Hooks do useOtp.ts
  const sendOtpMutation = useSendOtp()
  const validateOtpMutation = useValidateOtp()

  const [showPassword, setShowPassword] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  // Estados do Dialog de OTP
  const [isOtpOpen, setIsOtpOpen] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [otpError, setOtpError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  const next = searchParams.get("next") || "/"

  // Cronômetro do botão de reenvio
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        setFeedback("As senhas não conferem.")
        return
      }

      setFeedback(null)
      try {
        // 1. Faz o pré-cadastro do usuário
        await registerMutation.mutateAsync({
          name: value.name,
          email: value.email,
          password: value.password,
        })

        // 2. Dispara o e-mail inicial com o código OTP
        await sendOtpMutation.mutateAsync({
          email: value.email,
          username: value.name,
        })
        
        // Abre o modal se tudo correr bem
        setIsOtpOpen(true)
        setCountdown(60)
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "Não foi possível concluir o cadastro agora."
        setFeedback(message)
      }
    },
  })

  // Envio automático ou manual do código de 6 dígitos
  async function handleOtpSubmit(code: string) {
    setOtpError(null)

    try {

      // Passo 1: Valida se o código de 6 dígitos está correto
      await validateOtpMutation.mutateAsync({
        email: form.state.values.email,
        otpCode: code,
      })

      // Passo 2: Ativa a conta do usuário no banco de dados
      await enableUserMutation.mutateAsync({
        email: form.state.values.email
      })

      // Passo 3: Faz o login de fato para gerar a sessão/cookies de autenticação
      await loginMutation.mutateAsync({
        email: form.state.values.email,
        password: form.state.values.password,
      })

      setIsOtpOpen(false)
      navigate(next, { replace: true })

    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Código inválido ou expirado."
      setOtpError(message)
    }
  }

  // Ação de reenvio do código
  async function handleResendOtp() {
    if (countdown > 0) return
    setOtpError(null)
    
    try {
      await sendOtpMutation.mutateAsync({
        email: form.state.values.email,
        username: form.state.values.name,
      })
      setOtpValue("") 
      setCountdown(60) 
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Não foi possível reenviar o código."
      setOtpError(message)
    }
  }

  function handleGoogleRegister() {
    window.location.assign(`${getApiBaseUrl()}/oauth2/authorization/google`)
  }

  function handleFacebookRegister() {
    window.location.assign(`${getApiBaseUrl()}/oauth2/authorization/facebook`)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-6 duration-500">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field name="name">
          {(field) => (
            <div className="group relative">
              <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Digite seu nome completo"
                className="h-12 rounded-xl border-border bg-secondary/50 pl-10 transition-all focus:border-primary/50"
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
                onChange={(event) => field.handleChange(event.target.value)}
                type="email"
                placeholder="Digite seu e-mail"
                className="h-12 rounded-xl border-border bg-secondary/50 pl-10 transition-all focus:border-primary/50"
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
                onChange={(event) => field.handleChange(event.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Crie uma senha forte"
                className="h-12 rounded-xl border-border bg-secondary/50 pr-10 pl-10 transition-all focus:border-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
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
                onChange={(event) => field.handleChange(event.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                className="h-12 rounded-xl border-border bg-secondary/50 pl-10 transition-all focus:border-primary/50"
              />
            </div>
          )}
        </form.Field>

        {feedback ? <p className="text-sm text-destructive">{feedback}</p> : null}

        <p className="px-1 text-[10px] leading-relaxed text-muted-foreground">
          Ao se cadastrar, você concorda com nossos Termos de Serviço e Política de Privacidade.
        </p>

        <Button
          type="submit"
          className="h-12 w-full cursor-pointer rounded-xl font-semibold shadow-lg shadow-primary/20"
          disabled={registerMutation.isPending || sendOtpMutation.isPending}
        >
          {registerMutation.isPending || sendOtpMutation.isPending ? "Criando conta..." : "Criar conta"}
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </form>

      <div className="relative flex items-center gap-4">
        <Separator className="flex-1 bg-secondary" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Ou cadastre-se com
        </span>
        <Separator className="flex-1 bg-secondary" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-11 cursor-pointer rounded-xl border-border bg-secondary/50 transition-all hover:bg-secondary"
          onClick={handleGoogleRegister}
        >
          <img src={GoogleLogo} alt="Google" className="mr-2 w-4" />
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-11 cursor-pointer rounded-xl border-border bg-secondary/50 transition-all hover:bg-secondary"
          onClick={handleFacebookRegister}
        >
          <span className="mr-2 text-[1.25rem] font-bold text-blue-500">f</span>
          Facebook
        </Button>
      </div>

      {/* ========== DIALOG DE VERIFICAÇÃO OTP ========== */}
      <Dialog 
        open={isOtpOpen} 
        onOpenChange={(open) => !validateOtpMutation.isPending && setIsOtpOpen(open)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl border-border bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
              <Mail className="size-6" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight">Verifique seu e-mail</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground max-w-xs mt-1">
              Enviamos um código de 6 dígitos para o e-mail informado. Insira-o abaixo para concluir seu cadastro.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 flex flex-col items-center justify-center gap-4">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value) => {
                setOtpValue(value)
                if (value.length === 6) handleOtpSubmit(value)
              }}
              disabled={validateOtpMutation.isPending}
            >
              <InputOTPGroup className="gap-2">
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-12 w-10 sm:w-12 rounded-xl border border-border bg-secondary/30 text-center text-lg font-semibold transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {otpError ? (
              <p className="text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                {otpError}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="button"
              className="h-11 w-full rounded-xl font-semibold shadow-md"
              disabled={otpValue.length !== 6 || validateOtpMutation.isPending}
              onClick={() => handleOtpSubmit(otpValue)}
            >
              {validateOtpMutation.isPending ? "Verificando..." : "Confirmar Código"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="h-10 w-full text-xs text-muted-foreground hover:text-foreground rounded-xl"
              onClick={handleResendOtp}
              disabled={countdown > 0 || sendOtpMutation.isPending}
            >
              {countdown > 0 ? (
                `Reenviar código em ${countdown}s`
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <RefreshCw 
                    size={12} 
                    className={sendOtpMutation.isPending ? "animate-spin" : ""} 
                  />
                  {sendOtpMutation.isPending ? "Reenviando..." : "Não recebeu o código? Enviar novamente"}
                </span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Register