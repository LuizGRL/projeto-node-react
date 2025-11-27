import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbContext } from '../../context/BreadcrumbContext';

const defaultLabels: Record<string, string> = {
  'library': 'Biblioteca',
  'books': 'Livros',
  'new': 'Novo',
  'edit': 'Editar'
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const { titles } = useContext(BreadcrumbContext) as any;
  
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex mb-5 max-h-fit ml-[24px]" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3 max-h-fit">
        
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
            <Home className="w-4 h-4 mr-2 mb-0.5" />
            Início
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = titles[to] || defaultLabels[value] || value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight className="w-5 h-5 text-gray-400" />
                {isLast ? (
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {displayName}
                  </span>
                ) : (
                  <Link to={to} className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
                    {displayName}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};