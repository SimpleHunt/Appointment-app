"use client";

import { useState, useEffect } from 'react';
import { User, Report } from '@/app/page';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { ProfilePage } from '@/components/ProfilePage';
import { ReviewReportModal } from '@/components/ReviewReportModal';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import Footer from './Footer';

interface BDMDashboardProps {
  user: User;
  onLogout: () => void;
}

export function BDMDashboard({ user, onLogout }: BDMDashboardProps) {
  const [activeTab, setActiveTab] = useState<'reports' | 'profile'>('reports');
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
    
    // Set up real-time subscription for new reports
    const subscription = supabase
      .channel('all_reports_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'reports'
        }, 
        () => {
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setReports(data as Report[]);
    }
    setLoading(false);
  };

  const pendingReports = reports.filter((r) => r.status === 'pending');
  const doneReports = reports.filter((r) => r.status !== 'pending');

  const filteredReports = 
    filter === 'pending' ? pendingReports :
    filter === 'done' ? doneReports :
    reports;

  const handleReview = async (reportId: string, status: 'accepted' | 'rejected' | 'rescheduled', remarks: string,rescheduled_date:string) => {
    const { data, error } = await supabase
      .from('reports')
      .update({
        status,
        bdm_remarks: remarks,
        rescheduled_date: rescheduled_date,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId)
      .select()
      .single();

    if (data && !error) {
      setReports(reports.map((r) => r.id === reportId ? data as Report : r));
      setSelectedReport(null);
    } else {
      alert('Error updating report: ' + error?.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rescheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'reports'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Appointment
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Profile
          </button>
        </div>

        {activeTab === 'reports' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-1">Total Appointments</p>
                <p className="text-gray-900">{reports.length}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-1">Pending Review</p>
                <p className="text-gray-900">{pendingReports.length}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-1">Reviewed</p>
                <p className="text-gray-900">{doneReports.length}</p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-900">All Appointment</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'pending'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('done')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'done'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Done
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className={`bg-white rounded-xl shadow-sm border-2 ${getStatusColor(report.status)} p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        
                        <h3 className="text-gray-900">{report.company_name}</h3>
                        <h3 className="text-gray-900">{report.contact_person}</h3>
                        <h3 className="text-gray-900">{report.contact_number}</h3>
                        <h3 className="text-gray-900">{report.address}</h3>
                        <h3 className="text-gray-900">{report.scheduled_date}</h3>
                        <span className={`px-4 py-2 rounded-full ml-4 ${getStatusColor(report.status)} capitalize flex-shrink-0`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{report.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>Sales Appoinment: {report.inside_sales_name}</span>
                        <span>•</span>
                        <span>Created: {new Date(report.created_at).toLocaleDateString()}</span>
                      </div>

                      {report.bdm_remarks && (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
                          <p className="text-indigo-900 mb-1">Your Feedback:</p>
                          <p className="text-indigo-700">Rescheduled: <span className="text-indigo-700" >{report.rescheduled_date}</span></p>
                          <p className="text-indigo-700">Remarks: <span className="text-indigo-700" >{report.bdm_remarks}</span></p>
                        </div>
                      )}

                      {report.status === 'pending' && (
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Review Appointment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredReports.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-gray-900 mb-2">No Appointment found</h3>
                  <p className="text-gray-600">
                    {filter === 'pending' && 'All reports have been reviewed'}
                    {filter === 'done' && 'No reviewed reports yet'}
                    {filter === 'all' && 'No reports available'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && <ProfilePage user={user} />}
      </div>

      {selectedReport && (
        <ReviewReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onReview={handleReview}
        />
      )}
      <Footer/>
    </div>
  );
}
