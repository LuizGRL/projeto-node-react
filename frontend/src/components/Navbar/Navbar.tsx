import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo.png";
import { ChevronDownIcon } from "lucide-react";

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  const navLinks = [
    { name: "Acervo", path: "/library" },
    { name: "Meus Empréstimos", path: "/my-loans" },
    ...(user?.role === "ADMIN" ? [
      { 
        name: "Gerenciar", 
        path: "#",
        subLinks: [
          { name: "Livros", path: "/admin/books" },
          { name: "Autores", path: "/admin/authors" },
          { name: "Editoras", path: "/admin/publishers" },
          { name: "Usuários", path: "/accounts" }
        ]
      }
    ] : []),
  ];

  return (
    <nav className="bg-white shadow-md w-full z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/library')}>
            <img className="h-8 w-auto" src={logo} alt="Logo" />
            <span className="font-bold text-xl text-primary-dark hidden md:block">
              Biblioteca
            </span>
          </div>
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group h-full flex items-center">
                {link.subLinks ? (
                  <>
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors focus:outline-none">
                      {link.name}
                      <ChevronDownIcon className="h-4 w-4 transition-transform group-hover:rotate-180" />
                    </button>

                    <div className="absolute top-12 left-0 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 hidden group-hover:block transition-all">
                      {link.subLinks.map((subLink) => (
                        <NavLink
                          key={subLink.path}
                          to={subLink.path}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary ${
                              isActive ? "bg-gray-50 text-primary font-semibold" : ""
                            }`
                          }
                        >
                          {subLink.name}
                        </NavLink>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Se NÃO tiver subLinks, renderiza link normal */
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-primary border-b-2 border-primary"
                          : "text-gray-500 hover:text-primary hover:bg-gray-50"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Olá, <strong>{user?.name?.split(" ")[0]}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Sair
            </button>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 max-h-screen overflow-y-auto">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.subLinks ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-base font-medium text-gray-600 border-l-4 border-transparent">
                      {link.name}
                    </div>
                    {link.subLinks.map((subLink) => (
                       <NavLink
                         key={subLink.path}
                         to={subLink.path}
                         onClick={() => setIsMenuOpen(false)}
                         className={({ isActive }) =>
                           `block pl-8 pr-3 py-2 rounded-md text-sm font-medium ${
                             isActive
                               ? "text-primary bg-primary/5"
                               : "text-gray-500 hover:text-primary hover:bg-gray-50"
                           }`
                         }
                       >
                         {subLink.name}
                       </NavLink>
                    ))}
                  </div>
                ) : (
                  <NavLink
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium ${
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-gray-600 hover:text-primary hover:bg-gray-50"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                )}
              </div>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2">
                <p className="px-3 text-sm text-gray-500 mb-2">Logado como: {user?.name}</p>
                <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-500 font-medium hover:bg-red-50 rounded-md"
                >
                    Sair do Sistema
                </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}