// components/TeamGridView.tsx
import { useEffect, useState } from 'react';
import { CrewMember } from '@/app/types/organization';
import CrewMemberCard from './CrewMemberCard';
import { FiGrid, FiList, FiFilter, FiSearch } from 'react-icons/fi';

interface TeamGridViewProps {
  crewMembers: CrewMember[];
  onUpdateRole: (userId: number, role: string) => Promise<void>;
  onRemoveMember: (userId: number) => Promise<void>;
}

export default function TeamGridView({ crewMembers, onUpdateRole, onRemoveMember }: TeamGridViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredMembers, setFilteredMembers] = useState<CrewMember[]>(crewMembers);

  useEffect(() => {
    // Filter and search members
    let result = [...crewMembers];
    
    // Apply role filter
    if (filter !== 'all') {
      result = result.filter(member => member.role?.toUpperCase() === filter);
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(member => 
        member.name?.toLowerCase().includes(term) || 
        member.email?.toLowerCase().includes(term) ||
        member.telegram?.toLowerCase().includes(term)
      );
    }
    
    setFilteredMembers(result);
  }, [crewMembers, filter, searchTerm]);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5"
            placeholder="Пошук учасників"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 flex items-center rounded-l-lg ${
                viewMode === 'grid' 
                  ? 'bg-purple-100 text-purple-700 border-r border-purple-200' 
                  : 'bg-white text-gray-700 border-r border-gray-200'
              }`}
            >
              <FiGrid className="mr-1" /> Сітка
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 flex items-center rounded-r-lg ${
                viewMode === 'list' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-white text-gray-700'
              }`}
            >
              <FiList className="mr-1" /> Список
            </button>
          </div>
          
          <div className="relative">
            <select
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 pr-8 appearance-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Всі ролі</option>
              <option value="ADMIN">Адміністратори</option>
              <option value="MODERATOR">Модератори</option>
              <option value="MEMBER">Учасники</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FiFilter size={14} />
            </div>
          </div>
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <div className="text-gray-500">Не знайдено учасників команди</div>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
          : "space-y-4"
        }>
          {filteredMembers.map((member) => (
            <CrewMemberCard 
              key={member.id}
              member={member}
              onUpdateRole={onUpdateRole}
              onRemove={onRemoveMember}
            />
          ))}
        </div>
      )}
    </div>
  );
}