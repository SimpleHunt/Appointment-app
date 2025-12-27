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
  const [bdmList, setBdmList] = useState<{ id: string; name: string }[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
    fetchBDMs();
    
    
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
      .eq("bdm_id", user.id)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setReports(data as Report[]);
    }
    setLoading(false);
  };

  const fetchBDMs = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, role")
    .eq("role", "bdm"); 

  if (data && !error) {
    setBdmList(data as any);
  }
};

const handleTransfer = async (reportId: string, newBdmId: string) => {
  const { data, error } = await supabase
    .from("reports")
    .update({
      bdm_id: newBdmId,
      status: "pending", 
      updated_at: new Date().toISOString()
    })
    .eq("id", reportId)
    .select()
    .single();

  if (error) {
    alert("Failed to transfer report: " + error.message);
    return;
  }

  alert("Report transferred successfully!");

 
  setReports((prev) =>
    prev.filter((r) => r.id !== reportId)
  );

  setSelectedReport(null);
};

  const pendingReports = reports.filter((r) => r.status === 'pending');
  const doneReports = reports.filter((r) => r.status !== 'pending');

  const filteredReports = 
    filter === 'pending' ? pendingReports :
    filter === 'done' ? doneReports :
    reports;

  const handleReview = async (reportId: string, status: 'accepted' | 'rejected' | 'rescheduled', remarks: string | null,
    rescheduled_date: string | null,
      rescheduled_time: string | null
  ) => {
    const { data, error } = await supabase
      .from('reports')
      .update({
        status,
        bdm_remarks: remarks,
        rescheduled_date: rescheduled_date,
        rescheduled_time: rescheduled_time,
        reviewed_by_name: user.name,
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

  const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:gap-2">
    <span className="text-gray-500 min-w-[130px]">{label}:</span>
    <span className="text-gray-900">{value}</span>
  </div>
);


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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
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
                  <div
                    key={report.id}
                    className={`bg-white rounded-xl shadow-sm border-2 ${getStatusColor(
                      report.status
                    )} p-4 sm:p-6`}
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Company Name: {report.company_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Contact Person {report.contact_person} 
                        </p>
                        <p className="text-sm text-gray-500">
                          Contact: {report.contact_number}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                          report.status
                        )} capitalize self-start sm:self-auto`}
                      >
                        {report.status}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm mb-4">
                      <Detail label="Address" value={report.address} />
                      <Detail label="Scheduled Date" value={report.scheduled_date} />
                      <Detail label="Scheduled Time" value={report.scheduled_time} />
                      <Detail label="Sales Appointment" value={report.inside_sales_name} />
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4">
                      {report.description}
                    </p>

                    {/* Meta */}
                    <div className="text-xs text-gray-500 mb-4">
                      Created: {new Date(report.created_at).toLocaleDateString()}
                    </div>

                    {/* BDM Feedback */}
                    {report.bdm_remarks && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4 text-sm">
                        <p className="font-medium text-indigo-900 mb-2">Your Feedback</p>
                        <p>Rescheduled Date: <span className="text-indigo-700">{report.rescheduled_date}</span></p>
                        <p>Rescheduled Time: <span className="text-indigo-700">{report.rescheduled_time}</span></p>
                        <p>Remarks: <span className="text-indigo-700">{report.bdm_remarks}</span></p>
                      </div>
                    )}

                    {/* Action */}
                    {report.status === "pending" && (
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Review Appointment
                      </button>
                    )}
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
           onTransfer={handleTransfer}  
           bdmList={bdmList} 
        />
      )}
      <div className='pb-24'>
          <Footer/>
        </div>
    </div>
  );
}
