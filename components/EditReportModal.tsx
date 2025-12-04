"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface EditReportModalProps {
  report: {
    id: string;
    company_name: string;
    contact_person: string;
    contact_number: string;
    scheduled_date: string;
    lead_source:string;
    address: string;
    description: string;
  };
  onClose: () => void;
  onEdit: (
    reportId: string,
    updatedData: {
      company_name: string;
      contact_person: string;
      contact_number: string;
      scheduled_date: string;
      lead_source:string
      address: string;
      description: string;
    }
  ) => void;
}

export function EditReportModal({ report, onClose, onEdit }: EditReportModalProps) {
  const [formData, setFormData] = useState({
    company_name: report.company_name,
    contact_person: report.contact_person,
    contact_number: report.contact_number,
    scheduled_date: report.scheduled_date,
    lead_source:report.lead_source,
    address: report.address,
    description: report.description,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(report.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-900">Edit Appointment</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Company Name */}
          <div>
            <label className="block text-gray-700 mb-2">Company Name *</label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-gray-700 mb-2">Contact Person *</label>
            <input
              type="text"
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-gray-700 mb-2">Contact Number *</label>
            <input
              type="text"
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Scheduled Date */}
          <div>
            <label className="block text-gray-700 mb-2">Scheduled Date *</label>
            <input
              type="date"
              value={formData.scheduled_date}
              onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
              <label htmlFor="source" className="block text-gray-700 mb-2">
                Lead Source *
              </label>
              <select
                id="source"
                value={formData.lead_source}
                onChange={(e) => setFormData({ ...formData, lead_source: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="data mining">Data Mining</option>
                <option value="social media">Social Media</option>
                
              </select>
            </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 mb-2">Address *</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-32"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-32"
              required
            />
          </div>

          {/* Buttons */}
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
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
