"use client";

import { useState, useEffect } from "react";
import { Report } from "../app/page";
import {
  X,
  CheckCircle,
  XCircle,
  Calendar,
  Share2,
} from "lucide-react";

interface ReviewReportModalProps {
  report: Report;
  onClose: () => void;
  onReview: (
      reportId: string,
      status: "accepted" | "rejected" | "rescheduled",
      remarks: string | null,
      rescheduled_date: string | null,
      rescheduled_time: string | null
    ) => void;

  onTransfer: (reportId: string, newBdmId: string) => void;
  bdmList: { id: string; name: string }[];
}

export function ReviewReportModal({
  report,
  onClose,
  onReview,
  onTransfer,
  bdmList,
}: ReviewReportModalProps) {
  const [status, setStatus] = useState<
    "accepted" | "rejected" | "rescheduled"
  >("accepted");

  const [remarks, setRemarks] = useState("");
  const [rescheduled_date, setRescheduledDate] = useState("");
  const [rescheduled_time, setRescheduledTime] = useState("");

  // Transfer state
  const [showTransferBox, setShowTransferBox] = useState(false);
  const [selectedBdm, setSelectedBdm] = useState("");

  // Clear unused fields when status changes
  useEffect(() => {
    if (status === "accepted") {
      setRemarks("");
      setRescheduledDate("");
      setRescheduledTime("");
    }

    if (status === "rejected") {
      setRescheduledDate("");
      setRescheduledTime("");
    }
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onReview(
      report.id,
      status,
      status === "accepted" ? null : remarks,
      status === "rescheduled" ? rescheduled_date : null,
      status === "rescheduled" ? rescheduled_time : null
    );
  };


  const handleTransferSubmit = () => {
    if (!selectedBdm) return alert("Please select a BDM");
    onTransfer(report.id, selectedBdm);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-gray-900">Review Appointment</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* REPORT DETAILS */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3>Company Name: <span className="text-gray-600">{report.company_name}</span></h3>
            <h3>Contact Name: <span className="text-gray-600">{report.contact_person}</span></h3>
            <h3>Contact Number: <span className="text-gray-600">{report.contact_number}</span></h3>
            <h3>Address: <span className="text-gray-600">{report.address}</span></h3>
            <h3>Scheduled Date: <span className="text-gray-600">{report.scheduled_date}</span></h3>
            <h3>Scheduled Time: <span className="text-gray-600">{report.scheduled_time}</span></h3>
            <h3>Lead Source: <span className="text-gray-600">{report.lead_source}</span></h3>
            <p>Description: <span className="text-gray-600">{report.description}</span></p>

            {/* TRANSFER */}
            <button
              onClick={() => setShowTransferBox(!showTransferBox)}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-600"
            >
              <Share2 className="w-5 h-5" />
              Transfer Report to Another BDM
            </button>

            {showTransferBox && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg space-y-3">
                <select
                  className="w-full border px-4 py-2 rounded-lg"
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
                  className="w-full bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700"
                >
                  Transfer Now
                </button>
              </div>
            )}
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STATUS */}
            <div>
              <label className="block text-gray-700 mb-3">Feedback Status *</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* ACCEPT */}
                <button
                  type="button"
                  onClick={() => setStatus("accepted")}
                  className={`p-4 border-2 rounded-lg flex gap-3 ${
                    status === "accepted"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Accepted
                </button>

                {/* RESCHEDULE */}
                <button
                  type="button"
                  onClick={() => setStatus("rescheduled")}
                  className={`p-4 border-2 rounded-lg flex gap-3 ${
                    status === "rescheduled"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Rescheduled
                </button>

                {/* REJECT */}
                <button
                  type="button"
                  onClick={() => setStatus("rejected")}
                  className={`p-4 border-2 rounded-lg flex gap-3 ${
                    status === "rejected"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <XCircle className="w-6 h-6 text-red-600" />
                  Rejected
                </button>
              </div>
            </div>

            {/* RESCHEDULE FIELDS */}
            {status === "rescheduled" && (
              <>
                <input
                  type="date"
                  value={rescheduled_date}
                  onChange={(e) => setRescheduledDate(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg"
                  required
                />

                <input
                  type="time"
                  value={rescheduled_time}
                  onChange={(e) => setRescheduledTime(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg"
                  required
                />
              </>
            )}

            {/* REMARKS */}
            {(status === "rescheduled" || status === "rejected") && (
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg min-h-32"
                placeholder="Enter remarks"
                required
              />
            )}

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border px-6 py-3 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
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
