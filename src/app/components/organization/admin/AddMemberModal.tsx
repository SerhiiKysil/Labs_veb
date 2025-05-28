// components/AddMemberModal.tsx
import { useState, useEffect } from 'react';
import { FiX, FiSearch, FiCheckCircle } from 'react-icons/fi';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (userId: number) => Promise<void>;
  getAvailableUsers: () => Promise<User[]>;
}

export default function AddMemberModal({ isOpen, onClose, onAddMember, getAvailableUsers }: AddMemberModalProps) {
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const users = await getAvailableUsers();
      setAvailableUsers(users);
    } catch (err) {
      setError('Помилка при завантаженні користувачів');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    
    try {
      setLoading(true);
      await onAddMember(selectedUserId);
      onClose();
    } catch (err) {
      setError('Помилка при додаванні користувача');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = availableUsers.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Додати учасника</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Пошук користувача</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ім'я або електронна пошта"
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="max-h-60 overflow-y-auto mb-4">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Користувачів не знайдено</p>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map(user => (
                  <div 
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center ${
                      selectedUserId === user.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{user.name || 'Без імені'}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                    {selectedUserId === user.id && (
                      <FiCheckCircle className="text-purple-500" size={20} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Скасувати
            </button>
            <button
              onClick={handleAddMember}
              disabled={!selectedUserId || loading}
              className={`px-4 py-2 rounded-lg text-white ${
                selectedUserId && !loading 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-purple-400 cursor-not-allowed'
              }`}
            >
              {loading ? 'Додавання...' : 'Додати'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}