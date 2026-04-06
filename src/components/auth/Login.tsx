import { useState } from "react"
import { useNavigate } from "react-router"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useForm } from "@tanstack/react-form"

import GoogleLogo from "@/assets/google-logo.svg"
import { useLogin } from "@/hooks/useAuth"
import { ApiError, getApiBaseUrl } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

const Login = () => {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const {isSuccess, isPending} = loginMutation
  const [hidePassword, setHidePassword] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleSuccess = () => {
    toast("Logged in succesfully", {position: "top-right"})
    console.log("Log out");
  }
  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      setFeedback(null)

      try {
        await loginMutation.mutateAsync(value)
        navigate("/dashboard")
      } catch (error) {
        const message = error instanceof ApiError ? error.message : "Não foi possível autenticar agora."
        setFeedback(message)
      }
    },
  })

  function handleGoogleLogin() {
    window.location.assign(`${getApiBaseUrl()}/oauth2/authorization/google`)
  }

  isSuccess && handleSuccess();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-6 duration-500 ">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field name="email">
          {(field) => (
            <div className="space-y-2">
              <div className="group relative">
                <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="E-mail"
                  type="email"
                  className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 transition-all focus:border-primary/50"
                />
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <div className="space-y-2">
              <div className="group relative">
                <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Sua senha"
                  type={hidePassword ? "password" : "text"}
                  className="h-12 rounded-xl border-white/10 bg-white/5 pr-10 pl-10 transition-all focus:border-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setHidePassword(!hidePassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={hidePassword ? "Mostrar senha" : "Ocultar senha"}
                >
                  {hidePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}
        </form.Field>

        {feedback ? <p className="text-sm text-destructive">{feedback}</p> : null}

        <Button
          type="submit"
          className="h-12 w-full cursor-pointer rounded-xl font-semibold shadow-lg shadow-primary/20"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Entrando..." : "Entrar agora"}
        </Button>
      </form>

      <div className="relative flex items-center gap-4">
        <Separator className="flex-1 bg-white/10" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Ou continue com
        </span>
        <Separator className="flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-11 cursor-pointer rounded-xl border-white/10 bg-white/5 transition-all hover:bg-white/10"
          onClick={handleGoogleLogin}
        >
          <img src={GoogleLogo} alt="Google" className="mr-2 w-4" />
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-11 cursor-not-allowed rounded-xl border-white/10 bg-white/5 transition-all hover:bg-white/10"
          disabled
        >
          <span className="mr-2 text-[1.25rem] font-bold text-blue-500">f</span>
          Facebook
        </Button>
      </div>
    </div>
  )
}

export default Login