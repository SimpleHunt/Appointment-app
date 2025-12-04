"use client";

import { useState } from 'react';

import { LoginPage } from '../components/LoginPage';
import { BDMDashboard } from '@/components/BDMDashboard';
import { AdminDashboard } from '@/components/AdminDashboard';
import { InsideSalesDashboard } from '@/components/InsideSalesDashboard';

export type UserRole = 'admin' | 'inside_sales' | 'bdm';

export interface User {
  id: string;
  user_name: string;
  password: string;
  role: UserRole;
  name: string;
  age: number;
  position: string;
  phone: string;
  address: string;
  location: string;
  picture?: string;
}

export interface Report {
  id: string;
  company_name: string;
  contact_person: string;
  contact_number: string;
  address: string;
  description: string;
  inside_sales_id: string;
  inside_sales_name: string;
  status: 'pending' | 'accepted' | 'rescheduled' | 'rejected';
  scheduled_date:string;
  bdm_remarks?: string;
  rescheduled_date:string;
  lead_source:string;
  created_at: Date;
  updated_at: Date;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser.role === 'admin' && (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {currentUser.role === 'inside_sales' && (
        <InsideSalesDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {currentUser.role === 'bdm' && (
        <BDMDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;