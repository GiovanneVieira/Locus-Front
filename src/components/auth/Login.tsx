import { Link } from 'react-router';
import LocusLogo from '../LocusLogo';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Eye, EyeOff, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Separator } from '../ui/separator';
import FacebookLogo from '@/assets/facebook-logo.svg'
import GoogleLogo from '@/assets/google-logo.svg'

const Login = () => {
    const [hidePassword, setHidePassword] = useState(true);
    const passwordType = hidePassword ? 'password' : 'text';

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        onSubmit: async ({ value }) => {
            console.log(value);
        },
    });

    return (
        <div className="relative max-w-[30%] bg-background shadow border rounded-2xl gap-2 flex flex-col items-center">
            <Link to={'/'}>
                <X className="absolute right-2 top-2"></X>
            </Link>
            <Link
                to={'/'}
                className="mt-8 mb-4">
                <LocusLogo />
            </Link>
            <form
                className="flex flex-col items-center w-[80%]"
                target='"/"'
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}>
                <div className="flex flex-col gap-2 w-full mb-4">
                    <form.Field name="email">
                        {(field) => (
                            <Input
                                placeholder="Digite seu email ou número de celular"
                                type=""
                                className="rounded-xl"
                            />
                        )}
                    </form.Field>
                    <div className="relative">
                        <form.Field name="password">
                            {(field) => (
                                <Input
                                    placeholder="Digite sua senha"
                                    type={passwordType}
                                    className="rounded-xl"
                                />
                            )}
                        </form.Field>
                        {hidePassword ? (
                            <Button
                                className="absolute bg-transparent text-foreground right-1 cursor-pointer"
                                onClick={() => setHidePassword(false)}
                                type="button">
                                <EyeOff />
                            </Button>
                        ) : (
                            <Button
                                className="absolute bg-transparent text-foreground right-1 cursor-pointer"
                                onClick={() => setHidePassword(true)}
                                type="button">
                                <Eye />
                            </Button>
                        )}
                    </div>
                    <div className="flex justify-start w-full ">
                        <Link
                            to="/"
                            className="text-[clamp(calc(0.5rem),0.65rem,calc(0.75rem+1vw))] hover:text-accent-foreground">
                            Esqueceu sua senha?
                        </Link>
                    </div>
                </div>
                <Button className="w-[50%] max-[1024px]:w-full rounded-xl cursor-pointer">
                    Entre
                </Button>
            </form>
            <div className='flex w-[80%] justify-center items-center gap-2 overflow-hidden'>
                <Separator />
                <p>Ou</p>
                <Separator />
            </div>
            <div className="flex flex-col gap-2 w-full items-center py-4">
                <Button className="w-[80%] cursor-pointer rounded-xl bg-foreground justify-start">
                    <img src={GoogleLogo} alt="google" className='w-5 mr-1'/>Entrar com o google
                </Button>
                <Button className="w-[80%] cursor-pointer rounded-xl justify-start">
                    <img src={FacebookLogo} alt="facebook" className='w-5 mr-1'/>Entrar com o facebook
                </Button>
            </div>
        </div>
    );
};

export default Login;
