import React, { useState, useEffect } from 'react';
import { Mail, X, Trash2, Eye } from 'lucide-react';

export default function ContactLeads() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadToDelete, setLeadToDelete] = useState(null);

  const fetchLeads = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/contact-leads');
      const data = await response.json();
      if (data.success) {
        setLeads(data.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async () => {
    if (!leadToDelete) return;
    try {
      const response = await fetch(`http://localhost:5000/api/contact-leads/${leadToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        fetchLeads();
        setLeadToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const confirmDelete = (id) => {
    setLeadToDelete(id);
  };

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Contact Leads</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Company</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Service</th>
              <th className="px-6 py-4 font-medium">Budget</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{lead.fullName}</td>
                <td className="px-6 py-4 text-slate-600">{lead.companyName || '-'}</td>
                <td className="px-6 py-4 flex items-center text-brand-light">
                  <Mail className="w-4 h-4 mr-2" />
                  {lead.email}
                </td>
                <td className="px-6 py-4">{lead.service || '-'}</td>
                <td className="px-6 py-4">{lead.budget || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => handleViewDetails(lead)} className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 font-medium inline-flex items-center px-3 py-1.5 rounded-lg transition-colors text-xs">
                      View Details
                    </button>
                    <button onClick={() => confirmDelete(lead._id)} className="text-red-600 bg-red-50 hover:bg-red-100 font-medium inline-flex items-center px-3 py-1.5 rounded-lg transition-colors text-xs">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {selectedLead !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-500" />
                Contact Lead Details
              </h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[100px]">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-700 text-sm space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">Name</span>
                  <span className="font-medium text-slate-900">{selectedLead.fullName || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">Company</span>
                  <span className="font-medium text-slate-900">{selectedLead.companyName || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">Email</span>
                  <span className="font-medium text-slate-900">{selectedLead.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">Service</span>
                  <span className="font-medium text-slate-900 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">{selectedLead.service || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-500">Budget</span>
                  <span className="font-medium text-slate-900">{selectedLead.budget || 'N/A'}</span>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <span className="font-semibold text-slate-500">Project Details</span>
                  <div className="bg-white border border-slate-200 rounded-lg p-3 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedLead.projectDetails || 'No project details provided.'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {leadToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Lead?</h3>
            <p className="text-slate-500 text-sm mb-6">Are you sure you want to delete this contact lead? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setLeadToDelete(null)}
                className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2.5 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 shadow-md transition-all hover:-translate-y-0.5"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
