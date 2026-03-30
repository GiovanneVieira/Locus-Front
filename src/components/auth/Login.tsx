import { Link } from "react-router"
import LocusLogo from "../LocusLogo"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Eye, EyeOff, X } from "lucide-react"
import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { Separator } from "../ui/separator"
import FacebookLogo from "@/assets/facebook-logo.svg"
import GoogleLogo from "@/assets/google-logo.svg"

const Login = () => {
  const [hidePassword, setHidePassword] = useState(true)
  const passwordType = hidePassword ? "password" : "text"

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <div className="relative flex max-w-[30%] flex-col items-center gap-2 rounded-2xl border bg-background shadow">
      <Link to={"/"}>
        <X className="absolute top-2 right-2"></X>
      </Link>
      <Link to={"/"} className="mt-8 mb-4">
        <LocusLogo />
      </Link>
      <form
        className="flex w-[80%] flex-col items-center"
        target='"/"'
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="mb-4 flex w-full flex-col gap-2">
          <form.Field name="email">
            {() => (
              <Input
                placeholder="Digite seu email ou número de celular"
                type=""
                className="rounded-xl"
              />
            )}
          </form.Field>
          <div className="relative">
            <form.Field name="password">
              {() => (
                <Input
                  placeholder="Digite sua senha"
                  type={passwordType}
                  className="rounded-xl"
                />
              )}
            </form.Field>
            {hidePassword ? (
              <Button
                className="absolute right-1 cursor-pointer bg-transparent text-foreground"
                onClick={() => setHidePassword(false)}
                type="button"
              >
                <EyeOff />
              </Button>
            ) : (
              <Button
                className="absolute right-1 cursor-pointer bg-transparent text-foreground"
                onClick={() => setHidePassword(true)}
                type="button"
              >
                <Eye />
              </Button>
            )}
          </div>
          <div className="flex w-full justify-start">
            <Link
              to="/"
              className="text-[clamp(calc(0.5rem),0.65rem,calc(0.75rem+1vw))] hover:text-accent-foreground"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </div>
        <Button className="w-[50%] cursor-pointer rounded-xl max-[1024px]:w-full">
          Entre
        </Button>
      </form>
      <div className="flex w-[80%] items-center justify-center gap-2 overflow-hidden">
        <Separator />
        <p>Ou</p>
        <Separator />
      </div>
      <div className="flex w-full flex-col items-center gap-2 py-4">
        <Button className="w-[80%] cursor-pointer justify-start rounded-xl bg-foreground">
          <img src={GoogleLogo} alt="google" className="mr-1 w-5" />
          Entrar com o google
        </Button>
        <Button className="w-[80%] cursor-pointer justify-start rounded-xl">
          <img src={FacebookLogo} alt="facebook" className="mr-1 w-5" />
          Entrar com o facebook
        </Button>
      </div>
    </div>
  )
}

export default Login
