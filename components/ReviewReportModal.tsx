"use client";

import { useState } from 'react';
import { Report } from '../app/page';
import { X, CheckCircle, XCircle, Calendar, Share2 } from 'lucide-react';

interface ReviewReportModalProps {
  report: Report;
  onClose: () => void;
  onReview: (reportId: string, status: 'accepted' | 'rejected' | 'rescheduled', remarks: string,rescheduled_date:string,rescheduled_time: string,) => void;
  onTransfer:(reportId: string, newBdmId: string)=>void;
  bdmList: { id: string; name: string }[];
}

export function ReviewReportModal({ report, onClose, onReview,onTransfer,bdmList }: ReviewReportModalProps) {
  const [status, setStatus] = useState<'accepted' | 'rejected' | 'rescheduled'>('accepted');
  const [remarks, setRemarks] = useState('');
  const [rescheduled_date, setRescheduledDate] = useState('');
  const [rescheduled_time, setRescheduledtime] = useState('');

  // Transfer State
  const [showTransferBox, setShowTransferBox] = useState(false);
  const [selectedBdm, setSelectedBdm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReview(report.id, status, remarks,rescheduled_date,rescheduled_time);
  };

   const handleTransferSubmit = () => {
    if (!selectedBdm) return alert("Please select a BDM");
    onTransfer(report.id, selectedBdm);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-900">Review Appointment</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-gray-900 mb-2">Company Name:   <span className="text-gray-600" >{report.company_name}</span></h3>
                <h3 className="text-gray-900 mb-2">Contact Name:   <span className="text-gray-600" >{report.contact_person}</span></h3>
                <h3 className="text-gray-900 mb-2">Contact Number: <span className="text-gray-600" >{report.contact_number}</span></h3>
                <h3 className="text-gray-900 mb-2">Address: <span className="text-gray-600" >{report.address}</span></h3>
                <h3 className="text-gray-900 mb-2">Scheduled Date: <span className="text-gray-600" >{report.scheduled_date}</span></h3>
                <h3 className="text-gray-900 mb-2">Scheduled Date: <span className="text-gray-600" >{report.scheduled_time}</span></h3>
                <h3 className="text-gray-900 mb-2">Lead Source: <span className="text-gray-600" >{report.lead_source}</span></h3>
                <p className="text-gray-900 mb-3">Description: <span className="text-gray-600" >{report.description}</span></p>
             {/* TRANSFER BUTTON */}
          <button
            type="button"
            onClick={() => setShowTransferBox(!showTransferBox)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Transfer Report to Another BDM
          </button>

          {/* TRANSFER BOX */}
          {showTransferBox && (
            <div className="border p-4 rounded-lg bg-yellow-50 space-y-4">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={selectedBdm}
                onChange={(e) => setSelectedBdm(e.target.value)}
              >
                <option value="">Select BDM</option>
                {bdmList.map((bdm) => (
                  <option key={bdm.id} value={bdm.id}>
                    {bdm.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleTransferSubmit}
                className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Transfer Now
              </button>
            </div>
          )} 
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Sales Rep: {report.inside_sales_name}</span>
              <span>•</span>
              <span>Created: {new Date(report.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-3">
                Feedback Status *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('accepted')}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                    status === 'accepted'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <CheckCircle className={`w-6 h-6 ${status === 'accepted' ? 'text-green-600' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <p className="text-gray-900">Accepted</p>
                    <p className="text-gray-600 text-sm">Approve report</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('rescheduled')}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                    status === 'rescheduled'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Calendar className={`w-6 h-6 ${status === 'rescheduled' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <p className="text-gray-900">Reschedule</p>
                    <p className="text-gray-600 text-sm">Follow up later</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('rejected')}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                    status === 'rejected'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <XCircle className={`w-6 h-6 ${status === 'rejected' ? 'text-red-600' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <p className="text-gray-900">Rejected</p>
                    <p className="text-gray-600 text-sm">Decline report</p>
                  </div>
                </button>
              </div>
            </div>
                <div>
            <label htmlFor="title" className="block text-gray-700 mb-2">
              Rescheduled Date *
            </label>
            <input
              id="title"
              type="Date"
              value={rescheduled_date}
              onChange={(e) => setRescheduledDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
            />
          </div>

           <div>
            <label htmlFor="schedule-time" className="block text-gray-700 mb-2">
              Scheduled Time *
            </label>
            <input
              id="schedule-time"
              type="time"
              value={rescheduled_time}
              onChange={(e) => setRescheduledtime( e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

            <div>
              <label htmlFor="remarks" className="block text-gray-700 mb-2">
                Remarks *
              </label>
              <textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-32"
                placeholder="Provide your feedback and suggestions for the sales representative"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
