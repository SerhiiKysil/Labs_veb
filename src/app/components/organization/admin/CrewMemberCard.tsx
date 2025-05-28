// components/CrewMemberCard.tsx
import { useState } from 'react';
import { CrewMember } from '@/app/types/organization';
import { FiShield, FiUsers, FiUser, FiEdit, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';

interface CrewMemberCardProps {
  member: CrewMember;
  onUpdateRole: (userId: number, role: string) => Promise<void>;
  onRemove: (userId: number) => Promise<void>;
}

export default function CrewMemberCard({ member, onUpdateRole, onRemove }: CrewMemberCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newRole, setNewRole] = useState(member.role || 'MEMBER');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const roleLabels = {
    'ADMIN': 'Адміністратор',
    'MODERATOR': 'Модератор',
    'MEMBER': 'Учасник'
  };

  const roleIcons = {
    'ADMIN': <FiShield className="text-purple-600" />,
    'MODERATOR': <FiUsers className="text-blue-500" />,
    'MEMBER': <FiUser className="text-gray-500" />
  };

  const handleUpdateRole = async () => {
    await onUpdateRole(member.id, newRole);
    setIsEditing(false);
  };

  const handleRemove = async () => {
    await onRemove(member.id);
    setConfirmDelete(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            {member.name ? member.name.charAt(0).toUpperCase() : 'У'}
          </div>
          <div>
            <h3 className="font-medium">{member.name || 'Без імені'}</h3>
            <p className="text-sm text-gray-500">{member.email}</p>
          </div>
        </div>
        
        {member.telegram && (
          <div className="mt-2 text-sm text-gray-600">
            Telegram: {member.telegram}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="ADMIN">Адміністратор</option>
                  <option value="MODERATOR">Модератор</option>
                  <option value="MEMBER">Учасник</option>
                </select>
                <button 
                  onClick={handleUpdateRole}
                  className="text-green-600 hover:bg-green-100 p-1 rounded"
                >
                  <FiCheck size={16} />
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-red-600 hover:bg-red-100 p-1 rounded"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {roleIcons[member.role as keyof typeof roleIcons]}
                  <span className="ml-1">{roleLabels[member.role as keyof typeof roleLabels] || member.role}</span>
                </span>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                >
                  <FiEdit size={14} />
                </button>
              </div>
            )}
          </div>
          
          <div>
            {confirmDelete ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Підтвердити?</span>
                <button 
                  onClick={handleRemove}
                  className="text-red-600 hover:text-red-900"
                >
                  <FiCheck size={16} />
                </button>
                <button 
                  onClick={() => setConfirmDelete(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setConfirmDelete(true)}
                className="text-red-600 hover:text-red-900"
              >
                <FiTrash2 size={18} />
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-2 flex justify-between items-center text-xs">
          <span className={`px-2 py-0.5 rounded ${member.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {member.verified ? 'Верифікований' : 'Не верифікований'}
          </span>
          <span className="text-gray-500">
            З {new Date(member.createdAt || '').toLocaleDateString('uk-UA')}
          </span>
        </div>
      </div>
    </div>
  );
}