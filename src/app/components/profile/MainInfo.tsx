import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import Link from "next/link";
import Loading from "../layout/LoadingUser";
import { CalendarDays, ChevronRight, Settings, LogOut, Lock, Plus, User } from "lucide-react";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import UserGuideComponent from "./UserGuideComponent";

interface Organization {
  id: number;
  name: string;
  description: string;
  activeEventsCount: number;
  logoUrl: string;
}

const UserProfile: React.FC = () => {
  const { userCurrent, refreshUser, logout } = useUser() || { userCurrent: null };
  const [loading, setLoading] = useState(true);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const router = useRouter();
  console.log(selectedOrganization)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await refreshUser();
      } finally {
        setLoading(false);
      }
    };

    if (!userCurrent) {
      loadData();
    } else {
      setLoading(false);
      if (userCurrent.organizations?.length > 0) {
        setSelectedOrganization(userCurrent.organizations[0]);
      }
    }
  }, [refreshUser, userCurrent]);

  const handleLogout = async () => {
    try {
      // Clear all cookies
      const cookies = Cookies.get();
      Object.keys(cookies).forEach(cookieName => {
        Cookies.remove(cookieName, { path: '/' });
        Cookies.remove(cookieName, { path: '/', domain: window.location.hostname });
      });

      // Clear specific cookies
      Cookies.remove('organizationId');
      Cookies.remove('JSESSIONID');
      Cookies.remove('authToken');
      Cookies.remove('userId');
      
      // Call context logout to clear session storage
      logout();

      // Make logout request to backend
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      // Redirect to opportunities page
      router.push('/opportunities');
      router.refresh(); // Force refresh the page to clear any cached state
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const displayedUser = userCurrent || {
    name: "Немає данних",
    email: "Немає пошти",
    telegram: null,
    role: { id: 4, name: "user" },
    isVerified: true,
    organizations: [
      {
        id: 1,
        name: "Помилка отримання організації",
        description: "Description 1",
        activeEventsCount: 5,
        logoUrl: "",
      },
      {
        id: 2,
        name: "Назва?",
        description: "Description 2",
        activeEventsCount: 3,
        logoUrl: "",
      },
    ],
  };

  return (
    <div className="max-w-full mx-auto px-4 py-8" style={{ maxWidth: "1200px" }}>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Block */}
          <div className="col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-sm border border-blue-100 order-1 md:order-1">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-md">
                <User size={48} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {displayedUser.name}
              </h2>
              <p className="text-gray-500 mt-1">{displayedUser.email}</p>
              
              {/*<div className="mt-4 inline-flex items-center px-4 py-1 rounded-full bg-blue-100 text-blue-600 relative group cursor-pointer">
                {displayedUser.role?.name === 'admin' && (
                  <Star size={16} className="mr-2 text-yellow-500" />
                )}
                {displayedUser.role?.name === 'publisher' && (
                  <Feather size={16} className="mr-2 text-purple-600" />
                )}
                {displayedUser.role?.name === 'user' && (
                  <UserIcon size={16} className="mr-2 text-blue-500" />
                )}
                  <span className="text-sm font-medium">
                    {displayedUser.role?.name === 'publisher'
                      ? 'Видавець'
                      : displayedUser.role?.name === 'superadmin'
                      ? 'Адміністратор'
                      : displayedUser.role?.name === 'user'
                      ? 'Користувач'
                      : displayedUser.role?.name}
                  </span>


                
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded-md px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  {displayedUser.role?.name === 'superadmin' && 'Ну крутий, ви Адміністратор із повним доступом'}
                  {displayedUser.role?.name === 'publisher' && 'У вас є верифікована організація і ви можете публікувати можливості'}
                  {displayedUser.role?.name === 'user' && 'У вас поки немає організацій'}
                </div>

              </div>*/}
            </div>
            
            <div className="space-y-3 mt-6">
              <p className="text-center text-blue-900 font-medium mb-6">
                Раді вітати тебе на Мотиві*!
              </p>
              <UserGuideComponent />
              <Link href="/restore" className="flex items-center justify-center gap-3 bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow">
                <Lock size={18} />
                <span>Змінити пароль</span>
              </Link>
              
              <button onClick={handleLogout} className="flex items-center justify-center gap-3 w-full bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow">
                <LogOut size={18} />
                <span>Вийти з акаунту</span>
              </button>
            </div>
            
            {/* Admin Panel Section */}
            {displayedUser.role?.name === "superadmin" && (
              <div className="mt-8 pt-6 border-t border-blue-100">
                <h3 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
                  <Settings size={18} />
                  <span>Управління системою</span>
                </h3>
                
                <div className="space-y-3">
                  <Link href="/admin" className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-red-50 to-orange-50 text-red-600 rounded-xl hover:shadow-md transition-all duration-200">
                    <span className="font-medium text-sm">Адміністрування організацій</span>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                  
                  <Link href="/admin/users" className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-red-50 to-orange-50 text-red-600 rounded-xl hover:shadow-md transition-all duration-200">
                    <span className="font-medium text-sm">Адміністрування користувачів</span>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                  
                  <Link href="/admin/manage-categories-types" className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-red-50 to-orange-50 text-red-600 rounded-xl hover:shadow-md transition-all duration-200">
                    <span className="font-medium text-sm">Типи і категорії</span>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Organizations Block */}
          <div className="col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 order-2 md:order-3">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Ваші Організації
              </h2>
              
              <Link href="/organization/create" className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 hover:translate-y-px">
                <Plus size={18} />
                <span>Створити</span>
              </Link>
            </div>
            
            {displayedUser.organizations?.length ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {displayedUser.organizations.map((org) => (
                  <Link href={`/organization/${org.id}`} key={org.id} className="group">
                    <div className="h-full bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                      <div className="flex items-center gap-4 mb-4">
                        {org.logoUrl ? (
                          <img src={org.logoUrl} alt={org.name} className="h-14 w-14 rounded-xl border border-gray-100 object-cover shadow-sm" />
                        ) : (
                          <div className="h-14 w-14 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
                            {org.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                            {org.name}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-1">{org.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg w-fit">
                        <CalendarDays className="w-4 h-4" />
                        <span className="text-sm font-medium">Активні події: {org.activeEventsCount}</span>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <div className="group-hover:translate-x-1 transition-transform duration-300 text-blue-500">
                          <ChevronRight />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-blue-50 rounded-xl">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <CalendarDays className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-gray-600 font-medium">У вас поки немає організацій.</p>
                <p className="text-gray-500 text-sm mt-1">Створіть першу організацію, щоб почати!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;