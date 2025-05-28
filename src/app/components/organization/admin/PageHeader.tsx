// components/ui/PageHeader.tsx

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backUrl?: string;
  backText?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, backUrl, backText, action }: PageHeaderProps) {
  const router = useRouter();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        {backUrl && (
          <button 
            onClick={() => router.push(backUrl)}
            className="flex items-center text-sm text-gray-500 hover:text-purple-600 mb-1 transition-colors"
          >
            <FiArrowLeft size={14} className="mr-1" /> {backText || 'Назад'}
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
      </div>
      
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}

// components/ui/StatsCard.tsx
import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  label: string;
  value: string | number;
}

export function StatsCard({ icon, iconBgColor, iconColor, label, value }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex items-center gap-4">
        <div className={`${iconBgColor} ${iconColor} p-3 rounded-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

// components/ui/LoadingSpinner.tsx
export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="text-gray-500">Завантаження...</p>
      </div>
    </div>
  );
}

// components/ui/ErrorDisplay.tsx
import { useRouter } from 'next/router';
import { FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';

interface ErrorDisplayProps {
  message: string;
  backUrl?: string;
  backText?: string;
}

export function ErrorDisplay({ message, backUrl, backText }: ErrorDisplayProps) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white border border-red-100 text-red-800 p-6 rounded-xl shadow-md max-w-md w-full">
        <div className="flex items-center gap-3 mb-3">
          <FiAlertTriangle size={24} className="text-red-600" />
          <h2 className="text-xl font-semibold">Помилка</h2>
        </div>
        <p className="text-gray-700">{message}</p>
        {backUrl && (
          <button 
            onClick={() => router.push(backUrl)}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
          >
            <FiArrowLeft size={16} /> {backText || 'Повернутися назад'}
          </button>
        )}
      </div>
    </div>
  );
}