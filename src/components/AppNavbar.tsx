import type { NavItem } from '@/constants/constants';
import { NavLink } from 'react-router';

const AppNavbar = ({
    navegacao,
    userRole,
}: {
    navegacao: NavItem[];
    userRole: string | undefined;
}) => {
    return userRole === 'admin'
        ? navegacao.map((item) => (
              <NavLink
                  key={item.rota}
                  to={item.rota}
                  className={({ isActive }) =>
                      [
                          'relative rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300',
                          isActive
                              ? 'border border-white/10 bg-white/10 text-foreground'
                              : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                      ].join(' ')
                  }>
                  {item.nome}
              </NavLink>
          ))
        : navegacao
              .filter(
                  (item) =>
                      item.nome != 'Dashboard' &&
                      item.rota != '/dashboard',
              )
              .map((item) => (
                  <NavLink
                      key={item.rota}
                      to={item.rota}
                      className={({ isActive }) =>
                          [
                              'relative rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300',
                              isActive
                                  ? 'border border-white/10 bg-white/10 text-foreground'
                                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                          ].join(' ')
                      }>
                      {item.nome}
                  </NavLink>
              ));
};

export default AppNavbar;
