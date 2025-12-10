"use client";

import { useState, useEffect } from 'react';
import { User, Report } from '@/app/page';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { ProfilePage } from '@/components/ProfilePage';
import { AddReportModal } from '@/components/AddReportModal';
import { EditReportModal } from '@/components/EditReportModal';
import { Plus, FileText, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import Footer from './Footer';


interface InsideSalesDashboardProps {
  user: User;
  onLogout: () => void;
}

export function InsideSalesDashboard({ user, onLogout }: InsideSalesDashboardProps) {
  const [activeTab, setActiveTab] = useState<'reports' | 'profile'>('reports');
  const [reports, setReports] = useState<Report[]>([]);
  const [bdmList, setBdmList] = useState<{ id: string; name: string }[]>([]);
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [showEditReportModal, setShowEditReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch BDMS
   const fetchBDMs = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("id, name")
      .eq("role", "bdm");

    if (!error && data) {
      setBdmList(data);
    }
  };
  useEffect(() => {
    fetchReports();
    fetchBDMs(); 
   
    const subscription = supabase
      .channel('reports_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'reports',
          filter: `inside_sales_id=eq.${user.id}`
        }, 
        () => {
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user.id]);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('inside_sales_id', user.id)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setReports(data as Report[]);
    }
    setLoading(false);
  };

  const pendingReports = reports.filter((r) => r.status === 'pending');
  const acceptedReports = reports.filter((r) => r.status === 'accepted');
  const rejectedReports = reports.filter((r) => r.status === 'rejected');
  const rescheduledReports = reports.filter((r) => r.status === 'rescheduled');


  const handleEditReport = async (reportId: string, updatedData: any) => {
  const { error } = await supabase
    .from("reports")
    .update({
      company_name: updatedData.company_name,
      contact_person: updatedData.contact_person,
      contact_number: updatedData.contact_number,
      scheduled_date: updatedData.scheduled_date,
      address: updatedData.address,
      description: updatedData.description,
      lead_source:updatedData.lead_source,
      scheduled_time: updatedData.scheduled_time,
      updated_at: new Date().toISOString()
    })
    .eq("id", reportId);

  if (error) {
    alert("Failed to update: " + error.message);
    return;
  }setShowEditReportModal(false);
  fetchReports();
  };

  const handleAddReport = async (newReport: { company_name: string; contact_person: string; contact_number: string; scheduled_date:string; address : string; description: string;lead_source:string;bdm_id:string;scheduled_time:string;}) => {
    const { data, error } = await supabase
      .from('reports')
      .insert([{
        company_name: newReport.company_name,
        contact_person: newReport.contact_person,
        contact_number: newReport.contact_number,
        scheduled_date:newReport.scheduled_date,
        address: newReport.address,
        description: newReport.description,
        lead_source:newReport.lead_source,
        inside_sales_id: user.id,
        inside_sales_name: user.name,
        bdm_id: newReport.bdm_id,
        scheduled_time: newReport.scheduled_time,
        status: 'pending'
      }])
      .select()
      .single();

    if (data && !error) {
      setReports([data as Report, ...reports]);
      setShowAddReportModal(false);
    } else {
      alert('Error creating report: ' + error?.message);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'rescheduled':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
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
    const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-800 border-yellow-200';
      case 'accepted':
        return ' text-green-800 border-green-200';
      case 'rejected':
        return ' text-red-800 border-red-200';
      case 'rescheduled':
        return ' text-blue-800 border-blue-200';
      default:
        return 'text-gray-800 border-gray-200';
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
            My Appointment
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-1">Pending</p>
                <p className="text-gray-900">{pendingReports.length}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-1">Accepted</p>
                <p className="text-gray-900">{acceptedReports.length}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-1">Rescheduled</p>
                <p className="text-gray-900">{rescheduledReports.length}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-1">Rejected</p>
                <p className="text-gray-900">{rejectedReports.length}</p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-900">All Appoinment</h2>
              <button
                onClick={() => setShowAddReportModal(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Appointment
              </button>
            </div>

            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className={`bg-white rounded-xl shadow-sm border-2 ${getStatusColor(report.status)} p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getStatusIcon(report.status)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-2">Company Name:   <span className={`${getStatusTextColor(report.status)}`} >{report.company_name}</span></h3>
                          <h3 className="text-gray-900 mb-2">Contact Name:   <span className={`${getStatusTextColor(report.status)}`} >{report.contact_person}</span></h3>
                          <h3 className="text-gray-900 mb-2">Contact Number: <span className={`${getStatusTextColor(report.status)}`} >{report.contact_number}</span></h3>
                          <h3 className="text-gray-900 mb-2">Address: <span className={`${getStatusTextColor(report.status)}`} >{report.address}</span></h3>
                          <h3 className="text-gray-900 mb-2">Scheduled Date: <span className={`${getStatusTextColor(report.status)}`} >{report.scheduled_date}</span></h3>
                          <h3 className="text-gray-900 mb-2">Scheduled Time: <span className={`${getStatusTextColor(report.status)}`} >{report.scheduled_time}</span></h3>
                          <h3 className="text-gray-900 mb-2">Lead Source: <span className={`${getStatusTextColor(report.status)}`} >{report.lead_source}</span></h3>
                        <p className="text-gray-900 mb-3">Description: <span className={`${getStatusTextColor(report.status)}`} >{report.description}</span></p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Created: {new Date(report.created_at).toLocaleDateString()}</span>
                          <span>Updated: {new Date(report.updated_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => {
                              setSelectedReport(report);
                              setShowEditReportModal(true);
                            }}
                            className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full ${getStatusColor(report.status)} capitalize`}>
                      {report.status}
                    </span>
                  </div>
                  
                  {report.bdm_remarks && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-4">
                      <p className="text-indigo-900 mb-1">BDM Feedback:</p>
                      <p className="text-indigo-900 mb-1">Rescheduled Date:  <span className="text-indigo-700" >{report.rescheduled_date}</span></p>
                      <p className="text-indigo-900 mb-1">Rescheduled Date:  <span className="text-indigo-700" >{report.rescheduled_date}</span></p>
                       <p className="text-indigo-900 mb-1">Reviewed by:  <span className="text-indigo-700" >{report.reviewed_by_name}</span></p>
                      <p className="text-indigo-900">Remarks: <span className="text-indigo-700" >{report.bdm_remarks}</span></p>
                    </div>
                  )}
                </div>
              ))}

              {reports.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-gray-900 mb-2">No Appointmnet yet</h3>
                  <p className="text-gray-600 mb-6">Create your first Appointment to get started</p>
                  <button
                    onClick={() => setShowAddReportModal(true)}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Create Appointment
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && <ProfilePage user={user} />}
      </div>

      {showAddReportModal && (
        <AddReportModal
          onClose={() => setShowAddReportModal(false)}
          onAdd={handleAddReport}
          bdmList={bdmList}
        />
      )}
      {showEditReportModal && selectedReport && (
          <EditReportModal
            report={selectedReport}
            onClose={() => setShowEditReportModal(false)}
            onEdit={handleEditReport}
          />
        )}
        <Footer/>
    </div>
  );
};
