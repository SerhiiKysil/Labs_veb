// utils/api-client.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/api/filter';

// Type definitions
export interface Category {
  id: number;
  name: string;
  visible: boolean;
}

export interface Type {
  id: number;
  name: string;
  visible: boolean;
}

// Category API calls
export const fetchAllCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${API_BASE_URL}/categories`);
  return response.data;
};

export const fetchVisibleCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${API_BASE_URL}/categories/visible`);
  return response.data;
};

export const createCategory = async (name: string): Promise<Category> => {
  const response = await axios.post(`${API_BASE_URL}/categories`, { name, visible: true });
  return response.data;
};

export const updateCategory = async (id: number, name: string, visible: boolean): Promise<Category> => {
  const response = await axios.put(`${API_BASE_URL}/categories/${id}`, { name, visible });
  return response.data;
};

export const updateCategoryVisibility = async (id: number, visible: boolean): Promise<Category> => {
  const response = await axios.patch(`${API_BASE_URL}/categories/${id}/visibility`, visible);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/categories/${id}`);
};

// Type API calls
export const fetchAllTypes = async (): Promise<Type[]> => {
  const response = await axios.get(`${API_BASE_URL}/types`);
  return response.data;
};

export const fetchVisibleTypes = async (): Promise<Type[]> => {
  const response = await axios.get(`${API_BASE_URL}/types/visible`);
  return response.data;
};

export const createType = async (name: string): Promise<Type> => {
  const response = await axios.post(`${API_BASE_URL}/types`, { name, visible: true });
  return response.data;
};

export const updateType = async (id: number, name: string, visible: boolean): Promise<Type> => {
  const response = await axios.put(`${API_BASE_URL}/types/${id}`, { name, visible });
  return response.data;
};

export const updateTypeVisibility = async (id: number, visible: boolean): Promise<Type> => {
  const response = await axios.patch(`${API_BASE_URL}/types/${id}/visibility`, visible);
  return response.data;
};

export const deleteType = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/types/${id}`);
};