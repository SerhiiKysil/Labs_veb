// pages/admin/manage-categories-types.tsx
"use client";
// pages/admin/manage-categories-types.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Pencil, 
  Trash2, 
} from 'lucide-react';
import Navbar from '@/app/components/layout/Navbar';

interface Category {
  id: number;
  name: string;
  visible: boolean;
}

interface Type {
  id: number;
  name: string;
  visible: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <div className="p-6">
          {children}
        </div>
      )}
    </div>
  );
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL +'/api/filter';

export default function ManageCategoriesTypes() {
  const [tabValue, setTabValue] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openTypeDialog, setOpenTypeDialog] = useState(false);
  const [openDeleteCategoryDialog, setOpenDeleteCategoryDialog] = useState(false);
  const [openDeleteTypeDialog, setOpenDeleteTypeDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentType, setCurrentType] = useState<Type | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTypeName, setNewTypeName] = useState('');
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isNewType, setIsNewType] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTypes();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/types`);
      setTypes(response.data);
    } catch (error) {
      console.error('Error fetching types:', error);
    }
  };

  const handleTabChange = (newValue: number) => {
    setTabValue(newValue);
  };

  // Category handlers
  const handleAddCategory = () => {
    setCurrentCategory(null);
    setNewCategoryName('');
    setIsNewCategory(true);
    setOpenCategoryDialog(true);
  };

  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setNewCategoryName(category.name);
    setIsNewCategory(false);
    setOpenCategoryDialog(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCurrentCategory(category);
    setOpenDeleteCategoryDialog(true);
  };

  const handleSaveCategory = async () => {
    try {
      if (isNewCategory) {
        await axios.post(`${API_BASE_URL}/categories`, {
          name: newCategoryName,
          visible: true
        });
      } else if (currentCategory) {
        await axios.put(`${API_BASE_URL}/categories/${currentCategory.id}`, {
          name: newCategoryName,
          visible: currentCategory.visible
        });
      }
      fetchCategories();
      setOpenCategoryDialog(false);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const confirmDeleteCategory = async () => {
    try {
      if (currentCategory) {
        await axios.delete(`${API_BASE_URL}/categories/${currentCategory.id}`);
        fetchCategories();
      }
      setOpenDeleteCategoryDialog(false);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleCategoryVisibilityChange = async (category: Category) => {
    try {
      await axios.patch(`${API_BASE_URL}/categories/${category.id}/visibility`, !category.visible);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category visibility:', error);
    }
  };

  // Type handlers
  const handleAddType = () => {
    setCurrentType(null);
    setNewTypeName('');
    setIsNewType(true);
    setOpenTypeDialog(true);
  };

  const handleEditType = (type: Type) => {
    setCurrentType(type);
    setNewTypeName(type.name);
    setIsNewType(false);
    setOpenTypeDialog(true);
  };

  const handleDeleteType = (type: Type) => {
    setCurrentType(type);
    setOpenDeleteTypeDialog(true);
  };

  const handleSaveType = async () => {
    try {
      if (isNewType) {
        await axios.post(`${API_BASE_URL}/types`, {
          name: newTypeName,
          visible: true
        });
      } else if (currentType) {
        await axios.put(`${API_BASE_URL}/types/${currentType.id}`, {
          name: newTypeName,
          visible: currentType.visible
        });
      }
      fetchTypes();
      setOpenTypeDialog(false);
    } catch (error) {
      console.error('Error saving type:', error);
    }
  };

  const confirmDeleteType = async () => {
    try {
      if (currentType) {
        await axios.delete(`${API_BASE_URL}/types/${currentType.id}`);
        fetchTypes();
      }
      setOpenDeleteTypeDialog(false);
    } catch (error) {
      console.error('Error deleting type:', error);
    }
  };

  const handleTypeVisibilityChange = async (type: Type) => {
    try {
      await axios.patch(`${API_BASE_URL}/types/${type.id}/visibility`, !type.visible);
      fetchTypes();
    } catch (error) {
      console.error('Error updating type visibility:', error);
    }
  };

  // Custom Dialog Component
  const Dialog = ({ open, onClose, title, children, actions }: { 
    open: boolean; 
    onClose: () => void; 
    title: string; 
    children: React.ReactNode; 
    actions: React.ReactNode 
  }) => {
    if (!open) return null;
    console.log(onClose);
    return (
        <>
        <Navbar/>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>
            <div className="p-4">
                {children}
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
                {actions}
            </div>
            </div>
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto p-6">
                <Navbar/>
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Адміністрування категорій і типів</h1>
        
        <div className="border-b border-gray-200 mb-6">
          <div className="flex">
            <button 
              className={`py-2 px-4 ${tabValue === 0 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleTabChange(0)}
            >
              Категорія
            </button>
            <button 
              className={`py-2 px-4 ${tabValue === 1 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleTabChange(1)}
            >
              Тип
            </button>
          </div>
        </div>

        {/* Categories Tab */}
        <TabPanel value={tabValue} index={0}>
          <div className="flex justify-end mb-4">
            <button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleAddCategory}
            >
              <Plus size={16} className="mr-2" />
              Додати категорію
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Назва</th>
                  <th className="py-2 px-4 border-b">Видимість</th>
                  <th className="py-2 px-4 border-b">Дії</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{category.id}</td>
                    <td className="py-2 px-4 border-b">{category.name}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={category.visible}
                          onChange={() => handleCategoryVisibilityChange(category)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button 
                        className="p-1 text-blue-500 hover:text-blue-700 mr-2"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        className="p-1 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabPanel>

        {/* Types Tab */}
        <TabPanel value={tabValue} index={1}>
          <div className="flex justify-end mb-4">
            <button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleAddType}
            >
              <Plus size={16} className="mr-2" />
              Додати тип
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Назва</th>
                  <th className="py-2 px-4 border-b">Видимість</th>
                  <th className="py-2 px-4 border-b">Дії</th>
                </tr>
              </thead>
              <tbody>
                {types.map((type) => (
                  <tr key={type.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{type.id}</td>
                    <td className="py-2 px-4 border-b">{type.name}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={type.visible}
                          onChange={() => handleTypeVisibilityChange(type)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button 
                        className="p-1 text-blue-500 hover:text-blue-700 mr-2"
                        onClick={() => handleEditType(type)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        className="p-1 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteType(type)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabPanel>
      </div>

      {/* Category Dialog */}
      <Dialog 
        open={openCategoryDialog} 
        onClose={() => setOpenCategoryDialog(false)}
        title={isNewCategory ? 'Add New Category' : 'Edit Category'}
        actions={
          <>
            <button 
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              onClick={() => setOpenCategoryDialog(false)}
            >
              Закрити
            </button>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleSaveCategory}
            >
              Зберегти
            </button>
          </>
        }
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryName">
            Назва Категорії
          </label>
          <input
            id="categoryName"
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            placeholder="Введіть назву категорії"
          />
        </div>
      </Dialog>

      {/* Type Dialog */}
      <Dialog 
        open={openTypeDialog} 
        onClose={() => setOpenTypeDialog(false)}
        title={isNewType ? 'Add New Type' : 'Edit Type'}
        actions={
          <>
            <button 
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              onClick={() => setOpenTypeDialog(false)}
            >
              Закрити
            </button>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleSaveType}
            >
              Зберегти
            </button>
          </>
        }
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="typeName">
            Назва Типу
          </label>
          <input
            id="typeName"
            type="text"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            placeholder="Введіть назву типу"
          />
        </div>
      </Dialog>

      {/* Delete Category Confirmation Dialog */}
      <Dialog 
        open={openDeleteCategoryDialog} 
        onClose={() => setOpenDeleteCategoryDialog(false)}
        title="Delete Category"
        actions={
          <>
            <button 
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              onClick={() => setOpenDeleteCategoryDialog(false)}
            >
              Закрити
            </button>
            <button 
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={confirmDeleteCategory}
            >
              Видалити
            </button>
          </>
        }
      >
        <p className="text-gray-700">
          Ви впевнені що хочете видалити категорію &quot;{currentCategory?.name}&quot;? Ця дія не може бути відмінена.
        </p>
      </Dialog>

      {/* Delete Type Confirmation Dialog */}
      <Dialog 
        open={openDeleteTypeDialog} 
        onClose={() => setOpenDeleteTypeDialog(false)}
        title="Delete Type"
        actions={
          <>
            <button 
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              onClick={() => setOpenDeleteTypeDialog(false)}
            >
              Закрити
            </button>
            <button 
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={confirmDeleteType}
            >
              Видалити
            </button>
          </>
        }
      >
        <p className="text-gray-700">
          Точно видалити тип &quot;{currentType?.name}&quot;? Зворотньої дії немає.
        </p>
      </Dialog>
    </div>
  );
}