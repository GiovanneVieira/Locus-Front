import { NavLink } from 'react-router';
import { navegacao } from '../constants/constants';

export const NavItems = ({ onClick }: { onClick?: () => void }) => (
    <>
        {navegacao.map((item) => (
            <NavLink
                key={item.rota}
                to={item.rota}
                onClick={onClick}
                className={({ isActive }) =>
                    [
                        'relative rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300',
                        isActive
                            ? 'border border-border bg-secondary text-foreground shadow-[0_10px_25px_rgba(0,0,0,0.12)]'
                            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
                    ].join(' ')
                }>
                {item.nome}
            </NavLink>
        ))}
    </>
);
