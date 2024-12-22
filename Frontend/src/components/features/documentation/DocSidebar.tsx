import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { DocSection } from './types';

interface DocSidebarProps {
  sections: DocSection[];
}

const DocSidebar: React.FC<DocSidebarProps> = ({ sections }) => {
  const location = useLocation();

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 flex-shrink-0 h-full overflow-y-auto bg-gray-900/50 backdrop-blur-xl border-r border-gray-800/50">
      <nav className="p-4">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link
                    to={item.path}
                    className={`flex items-center group px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                      isActiveLink(item.path)
                        ? 'bg-code-green/20 text-code-green'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <FiChevronRight 
                      className={`mr-2 h-4 w-4 transition-transform duration-200 ${
                        isActiveLink(item.path) ? 'text-code-green' : 'text-gray-400 group-hover:text-white'
                      }`}
                    />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default DocSidebar;
