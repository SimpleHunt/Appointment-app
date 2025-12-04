"use client";

import { useState } from 'react';
import {  X } from 'lucide-react';

interface AddReportModalProps {
  onClose: () => void;
  onAdd: (report: { company_name: string; contact_person: string; contact_number: string; scheduled_date:string; address : string; description: string; lead_source:string; }) => void;
}

export function AddReportModal({ onClose, onAdd }: AddReportModalProps) {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person:'',
    contact_number:'',
    scheduled_date: '',
    address:'',
    description: '',
    lead_source:'',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-900">Create New Appointment</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="company_name" className="block text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              id="company_name"
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter a Company Name"
              required
            />
          </div>

          <div>
            <label htmlFor="contact_person" className="block text-gray-700 mb-2">
              Contact Person *
            </label>
            <input
              id="contact_person"
              type="text"
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter a Contact Person Name"
              required
            />
          </div>

          <div>
            <label htmlFor="contact_number" className="block text-gray-700 mb-2">
              Contact Number *
            </label>
            <input
              id="contact_number"
              type="text"
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter a Contact Number"
              required
            />
          </div>

          <div>
            <label htmlFor="schedule-date" className="block text-gray-700 mb-2">
              Scheduled Date *
            </label>
            <input
              id="schedule-date"
              type="Date"
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

           <div>
            <label htmlFor="address" className="block text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-32"
              placeholder="Provide address"
              required
            />
          </div>
           


          <div>
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-32"
              placeholder="Provide detailed information about your sales activities, client interactions, and outcomes"
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
              Create Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
