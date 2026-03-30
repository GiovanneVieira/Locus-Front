import { Link } from "react-router"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { Separator } from "../ui/separator"
import GoogleLogo from "@/assets/google-logo.svg"

const Login = () => {
  const [hidePassword, setHidePassword] = useState(true)

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => { console.log(value) },
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
        {/* Email Input */}
        <div className="space-y-2">
          <form.Field name="email">
            {() => (
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="E-mail ou celular"
                  className="pl-10 h-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                />
              </div>
            )}
          </form.Field>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <form.Field name="password">
            {() => (
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Sua senha"
                  type={hidePassword ? "password" : "text"}
                  className="pl-10 pr-10 h-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setHidePassword(!hidePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {hidePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}
          </form.Field>
          
          <div className="flex justify-end">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Esqueceu sua senha?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 rounded-xl font-semibold shadow-lg shadow-primary/20 cursor-pointer">
          Entrar agora
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center gap-4">
        <Separator className="flex-1 bg-white/10" />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Ou continue com</span>
        <Separator className="flex-1 bg-white/10" />
      </div>

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 transition-all h-11 cursor-pointer">
          <img src={GoogleLogo} alt="Google" className="mr-2 w-4" />
          Google
        </Button>
        <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 transition-all h-11 cursor-pointer">
          {/* Usando ícone genérico caso não tenha o SVG do FB */}
          <span className="mr-2 font-bold text-blue-500 text-[1.25rem]">f</span>
          Facebook
        </Button>
      </div>
    </div>
  )
}

export default Login