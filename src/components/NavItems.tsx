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
                            ? 'border border-white/10 bg-white/10 text-foreground shadow-[0_10px_25px_rgba(0,0,0,0.12)]'
                            : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                    ].join(' ')
                }>
                {item.nome}
            </NavLink>
        ))}
    </>
);
