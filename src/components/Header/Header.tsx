import { Link } from 'react-router';
import Logo from '../LocusLogo';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { MoonStar, SearchIcon } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../theme-provider';

const Header = () => {
    const { theme, setTheme } = useTheme();
    return (
        <div className="flex justify-between items-center min-w-full bg-background p-3 shadow-[0px_0px_2px] shadow-primary gap-4">
            <Link to={'/'}>
                <Logo className="cursor-pointer"></Logo>
            </Link>
            <InputGroup className="rounded-2xl">
                <InputGroupInput placeholder="Search..." />
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
            </InputGroup>
            <div className="flex gap-2">
                <Button
                    className={`rounded-2xl p-4 cursor-pointer ${theme === 'dark' ? 'bg-secondary' : 'bg-primary-foreground'} text-lg text-foreground shadow hover:text-accent-foreground`}>
                    Entre
                </Button>
                <Button
                    variant={'default'}
                    className="rounded-2xl p-4 cursor-pointer text-lg hover:bg-accent-foreground shadow">
                    Cadastre-se
                </Button>
            </div>
            <div>
                {theme === 'dark' ? (
                    <Button
                        className="rounded-full cursor-pointer bg-secondary hover:text-accent-foreground hover:bg-border shadow"
                        onClick={() => setTheme('light')}>
                        <Sun />
                    </Button>
                ) : (
                    <Button
                        className="rounded-full cursor-pointer bg-background text-foreground  hover:bg-accent hover:text-accent-foreground shadow"
                        onClick={() => setTheme('dark')}>
                        <MoonStar />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Header;
