
import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

const Index = () => {
  const [user, setUser] = useState<{
    id: string;
    username: string;
    role: 'STUDENT' | 'ADMIN';
    name: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call - in real app, this would call your Spring Boot backend
    setTimeout(() => {
      // Mock authentication - replace with actual API call
      const mockUser = {
        id: username === 'admin' ? '1' : '2',
        username,
        role: username === 'admin' ? 'ADMIN' as const : 'STUDENT' as const,
        name: username === 'admin' ? 'Admin User' : 'John Doe'
      };
      
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <LoginForm onLogin={handleLogin} isLoading={isLoading} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {user.role === 'STUDENT' ? (
        <StudentDashboard user={user} onLogout={handleLogout} />
      ) : (
        <AdminDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
