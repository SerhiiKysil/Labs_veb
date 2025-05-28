"use client";

import React from "react";

interface FiltersProps {
  filters: {
    types: string[];
    categories: string[];
    startDate: string[];
    locations: string[];
    languages: string[];
  };
  activeFilters: {
    types: string[];
    categories: string[];
    startDate: Date | null;
    locations: string[];
    languages: string[];
  };
  onFilterUpdate: (filters: {
    types: string[];
    categories: string[];
    startDate: Date | null;
    locations: string[];
    languages: string[];
  }) => void;
}

const OpportunitiesFilter: React.FC<FiltersProps> = ({ 
  filters, 
  activeFilters, 
  onFilterUpdate 
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const toggleSelection = (
    filterType: 'types' | 'categories' | 'locations' | 'languages',
    value: string
  ) => {
    const currentFilters = [...activeFilters[filterType]];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(item => item !== value)
      : [...currentFilters, value];
    
    onFilterUpdate({
      ...activeFilters,
      [filterType]: newFilters
    });
  };

  const clearFilter = (filterType: 'types' | 'categories' | 'locations' | 'languages') => {
    onFilterUpdate({
      ...activeFilters,
      [filterType]: []
    });
  };

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onFilterUpdate({
      ...activeFilters,
      startDate: activeFilters.startDate?.getTime() === newDate.getTime() ? null : newDate
    });
  };

  const changeMonth = (offset: number) => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
    setCurrentMonth(newMonth);
  };

  const renderCalendar = () => {
    const days = daysInMonth(currentMonth);
    const firstDay = (firstDayOfMonth(currentMonth) + 6) % 7; // Adjust to start week on Monday
    const today = new Date();
    const calendarDays = [];
  
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }
  
    for (let day = 1; day <= days; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = activeFilters.startDate && 
        date.toDateString() === activeFilters.startDate.toDateString();
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isHighlighted = filters.startDate.some(
        d => new Date(d).toDateString() === date.toDateString()
      );
  
      calendarDays.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isPast}
          className={`w-10 h-10 rounded-full ${
            isSelected
              ? 'bg-dark-blue text-white'
              : isToday
              ? 'border border-dark-blue'
              : isHighlighted
              ? 'bg-blue-100'
              : isPast
              ? 'text-gray-300'
              : 'hover:bg-blue-100'
          }`}
        >
          {day}
        </button>
      );
    }
  
    return calendarDays;
  };

  const renderFilterSection = (
    title: string,
    filterType: 'types' | 'categories' | 'locations' | 'languages',
    items: string[]
  ) => (
    <div className="mb-6" >
      <h3 className="font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        <button
          className={`rounded-full border px-4 py-2 ${
            activeFilters[filterType].length === 0 
              ? "bg-blue-100 text-dark-blue" 
              : "text-dark-grey"
          }`}
          onClick={() => clearFilter(filterType)}
        >
          Всі
        </button>
        {items.map((item) => (
          <button
            key={item}
            className={`rounded-full border px-4 py-2 ${
              activeFilters[filterType].includes(item) 
                ? "bg-blue-100 text-dark-blue" 
                : "text-dark-grey"
            }`}
            onClick={() => toggleSelection(filterType, item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row justify-between px-4 py-8"style={{maxWidth:'1250px', marginLeft:'auto', marginRight:'auto'}}>
      <div className="flex-grow text-dark-blue">
        <h2 className="text-2xl font-bold mb-4">Знайди свою можливість</h2>
        
        {renderFilterSection("Вид", "types", filters.types)}
        {renderFilterSection("Тематика", "categories", filters.categories)}
        {renderFilterSection("Мова заходу", "languages", filters.languages)}
        {renderFilterSection("Локація", "locations", filters.locations)}
      </div>

      <div className="lg:ml-8 mt-8 lg:mt-0 w-full lg:w-auto">
        <h3 className="font-semibold mb-2 text-dark-blue">Дата початку</h3>
        <div className="w-full lg:w-64">
          <div className="flex justify-between mb-2 text-dark-blue">
            <button onClick={() => changeMonth(-1)}>&lt;</button>
            <span>{currentMonth.toLocaleString('uk-UA', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => changeMonth(1)}>&gt;</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-black">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map(day => (
              <div key={day} className="text-center font-semibold text-dark-blue">{day}</div>
            ))}
            {renderCalendar()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesFilter;