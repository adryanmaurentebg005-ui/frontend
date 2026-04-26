import React from 'react';
import { Link } from 'react-router-dom';

// ...existing code...
const NavBar = ({ loggedUser }) => {
    const isLoggedIn = Boolean(loggedUser?._id);

    const handleLogout = () => {
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-changed'));
        window.location.href = '/login';
    };

    return (
        <nav className="sticky top-0 z-40 shrink-0 border-b border-white bg-[#EE4D2D]">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <Link to={isLoggedIn ? '/itens' : '/login'} className="text-lg font-bold text-white">
                    Chopee™
                </Link>
                <ul className="flex items-center gap-4 text-sm font-medium text-white">
                    {isLoggedIn && (
                        <>
                            <li>
                                <Link to="/users" className="hover:opacity-90">
                                    Usuarios
                                </Link>
                            </li>
                            <li>
                                <Link to="/itens" className="hover:opacity-90">
                                    Produtos
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="hover:opacity-90">
                                    Pedidos
                                </Link>
                            </li>
                            <li>
                                <Link to="/coupons" className="hover:opacity-90">
                                    Cupons
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="hover:opacity-90">
                                    Perfil
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="hover:opacity-90">
                                    Sair
                                </button>
                            </li>
                        </>
                    )} 
                
                </ul>
            </div>
        </nav>
    );
};
// ...existing code...

export default NavBar;