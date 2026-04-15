import React from 'react';
import { Link } from 'react-router-dom';

// ...existing code...
const NavBar = () => {
    return (
        <nav className="border-b border-white bg-[#EE4D2D]">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <Link to="/" className="text-lg font-bold text-white">
                    Chopee™
                </Link>
                <ul className="flex items-center gap-4 text-sm font-medium text-white">
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
                        <Link to="/profile" className="hover:opacity-90">
                            Perfil
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};
// ...existing code...

export default NavBar;