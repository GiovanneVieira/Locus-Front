import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import GoogleLogo from "@/assets/google-logo.svg"

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      // Lógica para conectar com seu backend Spring Boot
      console.log("Dados de registro:", value)
    },
  })

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        {/* Nome Completo */}
        <form.Field name="name">
          {() => (
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Digite seu nome completo"
                className="h-12 rounded-xl bg-white/5 border-white/10 pl-10 transition-all focus:border-primary/50"
              />
            </div>
          )}
        </form.Field>

        {/* E-mail */}
        <form.Field name="email">
          {() => (
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="email"
                placeholder="Digite seu e-mail"
                className="h-12 rounded-xl bg-white/5 border-white/10 pl-10 transition-all focus:border-primary/50"
              />
            </div>
          )}
        </form.Field>

        {/* Senha */}
        <form.Field name="password">
          {() => (
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Crie uma senha forte"
                className="h-12 rounded-xl bg-white/5 border-white/10 pl-10 pr-10 transition-all focus:border-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          )}
        </form.Field>

        {/* Confirmação de Senha */}
        <form.Field name="confirmPassword">
          {() => (
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                className="h-12 rounded-xl bg-white/5 border-white/10 pl-10 transition-all focus:border-primary/50"
              />
              
            </div>
          )}
        </form.Field>

        <p className="px-1 text-[10px] leading-relaxed text-muted-foreground">
          Ao se cadastrar, você concorda com nossos Termos de Serviço e Política de Privacidade.
        </p>

        <Button type="submit" className="h-12 w-full rounded-xl font-semibold shadow-lg shadow-primary/20 cursor-pointer">
          Criar conta <ArrowRight size={16} className="ml-2" />
        </Button>
      </form>

      {/* Divisor Social */}
      <div className="relative flex items-center gap-4">
        <Separator className="flex-1 bg-white/10" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ou cadastre-se com</span>
        <Separator className="flex-1 bg-white/10" />
      </div>

      {/* Botão Social Unificado */}
      <Button variant="outline" className="h-11 w-full rounded-xl border-white/10 bg-white/5 transition-all hover:bg-white/10 cursor-pointer">
        <img src={GoogleLogo} alt="Google" className="mr-2 w-4" />
        Continuar com Google
      </Button>
    </div>
  )
}

export default Register