import React, { useState, useEffect, useRef } from 'react';

const MultiSelectDropdown = ({ items, onSelectionChange, selectedIds = [] }) => {

  const [selectedItems, setSelectedItems] = useState(() => {
    return items.filter(item => selectedIds.includes(item.id));
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);


  useEffect(() => {
    const currentIds = selectedItems.map(i => i.id);
    const isDifferent = 
       selectedIds.length !== currentIds.length || 
       !selectedIds.every(id => currentIds.includes(id));
    if (isDifferent) {
       setSelectedItems(items.filter(item => selectedIds.includes(item.id)));
    }
  }, [selectedIds, items]); 

  const filteredItems = items.filter(item => 
    !selectedItems.some(selected => selected.id === item.id)   );

  const handleSelect = (item) => {
    const newSelected = [...selectedItems, item];
    setSelectedItems(newSelected);
    setSearchTerm('');
    inputRef.current.focus();
    
    onSelectionChange(newSelected.map(i => i.id));
  };

  const handleRemove = (idToRemove) => {
    const newSelected = selectedItems.filter(item => item.id !== idToRemove);
    setSelectedItems(newSelected);
    
    onSelectionChange(newSelected.map(i => i.id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}> {/* Removi max-w-lg para preencher o pai */}
      
      <div 
        className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-lg bg-white min-h-[42px] cursor-text focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all"
        onClick={() => inputRef.current.focus()}
      >
        {selectedItems.map(item => (
          <div key={item.id} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium">
            <span>{item.nome}</span>
            <button 
              type="button"
              className="hover:text-blue-900 focus:outline-none flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(item.id);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
        
        <input
          ref={inputRef}
          className="flex-1 outline-none bg-transparent min-w-[80px] text-gray-700 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedItems.length === 0 ? "Selecione..." : ""}
        />
      </div>

      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <li 
                key={item.id} 
                className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors"
                onClick={() => handleSelect(item)}
              >
                {item.nome}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-400 text-center italic">
              Nenhum item encontrado
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectDropdown;