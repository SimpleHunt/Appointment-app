"use client";

import { useState, useEffect } from 'react';
import { User, Report } from '@/app/page';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { ProfilePage } from '@/components/ProfilePage';
import { AddUserModal } from '@/components/AddUserModal';
import { Users, FileText, Plus, TrendingUp, UserCheck, Clock } from 'lucide-react';
import Footer from './Footer';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'reports' | 'profile'>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedSalesId, setSelectedSalesId] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchReports();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setUsers(data as User[]);
    }
    setLoading(false);
  };

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setReports(data as Report[]);
    }
  };

  const insideSalesUsers = users.filter((u) => u.role === 'inside_sales');
  const bdmUsers = users.filter((u) => u.role === 'bdm');
  const adminUsers = users.filter((u) => u.role === 'admin');

  const filteredReports = selectedSalesId === 'all' 
    ? reports 
    : reports.filter((r) => r.inside_sales_id === selectedSalesId);

  const pendingReports = reports.filter((r) => r.status === 'pending').length;
  const acceptedReports = reports.filter((r) => r.status === 'accepted').length;

  const handleAddUser = async (newUser: Omit<User, 'id'>) => {
    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single();

    if (data && !error) {
      setUsers([data as User, ...users]);
      setShowAddUserModal(false);
    } else {
      alert('Error adding user: ' + error?.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        

        {/* ================= TABS ================= */}
        <div className="flex gap-6 border-b mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {["dashboard", "users", "reports", "profile"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-3 px-2 text-sm sm:text-base border-b-2 ${
                activeTab === tab
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-600"
              }`}
            >
              {tab === "dashboard"
                ? "Dashboard"
                : tab === "users"
                ? "Users"
                : tab === "reports"
                ? "Appointments"
                : "Profile"}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-1">Total Users</p>
                <p className="text-gray-900">{users.length}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-1">Inside Sales</p>
                <p className="text-gray-900">{insideSalesUsers.length}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-1">Pending Appointments</p>
                <p className="text-gray-900">{pendingReports}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-1">Accepted Appointments</p>
                <p className="text-gray-900">{acceptedReports}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {reports.slice(0, 5).map((report) => (
                  <div
                    key={report.id}
                    className="flex gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-gray-900 font-medium truncate">
                            Company Name: {report.company_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Contact Person: {report.contact_person} 
                          </p>
                          <p className="text-sm text-gray-500">
                            Contact Number: {report.contact_number}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs shrink-0 ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-1 text-sm text-gray-600 mb-2">
                        <p className="truncate">Address: {report.address}</p>
                        <p>Sales: {report.inside_sales_name}</p>
                      </div>

                      {/* Meta */}
                      <p className="text-gray-500 text-xs">
                        {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-900">User Management</h2>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add User
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-gray-900 mb-4">Administrators ({adminUsers.length})</h3>
                <div className="space-y-3">
                  {adminUsers.map((u) => (
                    <div key={u.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={u.picture || '/legacylogo.png'}
                        alt={u.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-gray-900">{u.name}</h4>
                        <p className="text-gray-600">{u.user_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-700">{u.position}</p>
                        <p className="text-gray-500">{u.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-gray-900 mb-4">Inside Sales ({insideSalesUsers.length})</h3>
                <div className="space-y-3">
                  {insideSalesUsers.map((u) => (
                    <div key={u.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={u.picture || '/legacylogo.png'}
                        alt={u.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-gray-900">{u.name}</h4>
                        <p className="text-gray-600">{u.user_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-700">{u.position}</p>
                        <p className="text-gray-500">{u.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-gray-900 mb-4">Business Development Managers ({bdmUsers.length})</h3>
                <div className="space-y-3">
                  {bdmUsers.map((u) => (
                    <div key={u.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={u.picture || '/legacylogo.png'}
                        alt={u.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-gray-900">{u.name}</h4>
                        <p className="text-gray-600">{u.user_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-700">{u.position}</p>
                        <p className="text-gray-500">{u.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-900">All Appointments</h2>
              <select
                value={selectedSalesId}
                onChange={(e) => setSelectedSalesId(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Inside Sales</option>
                {insideSalesUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-700">Title</th>
                      <th className="px-6 py-4 text-left text-gray-700">Sales Rep</th>
                      <th className="px-6 py-4 text-left text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                           <h3 className="text-gray-900 mb-2">Company Name:   <span className="text-gray-600" >{report.company_name}</span></h3>
                           <h3 className="text-gray-900 mb-2">Contact Name:   <span className="text-gray-600" >{report.contact_person}</span></h3>
                          <h3 className="text-gray-900 mb-2">Contact Number: <span className="text-gray-600" >{report.contact_number}</span></h3>
                          <h3 className="text-gray-900 mb-2">Address: <span className="text-gray-600" >{report.address}</span></h3>
                          <h3 className="text-gray-900 mb-2">Scheduled Date: <span className="text-gray-600" >{report.scheduled_date}</span></h3>
                          <h3 className="text-gray-900 mb-2">Lead Source: <span className="text-gray-600" >{report.lead_source}</span></h3>
                          <p className="text-indigo-900 mb-1">Reviewed by:  <span className="text-indigo-700" >{report.reviewed_by_name}</span></p>
                          <p className="text-gray-900 mb-3">Description: <span className="text-gray-600" >{report.description}</span></p>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{report.inside_sales_name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{new Date(report.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && <ProfilePage user={user} />}
      </div>

      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onAdd={handleAddUser}
        />
      )}
      <div className='pb-24'>
          <Footer/>
        </div>
    </div>
  );
}