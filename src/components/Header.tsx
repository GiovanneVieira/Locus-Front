import { Link } from 'react-router';
import Logo from './LocusLogo';

const Header = () => {
    return (
        <div className="flex min-w-full bg-primary p-4">
            <Link to={'/'}>
                <Logo className="cursor-pointer"></Logo>
            </Link>
        </div>
    );
};

export default Header;
