import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';

export default function ContactLeads() {
  const [leads, setLeads] = useState([]);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/contact-leads/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleViewMessage = (details) => {
    alert(details || "No project details provided.");
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
                  <button onClick={() => handleViewMessage(lead.projectDetails)} className="text-brand-light hover:text-brand-dark font-medium mr-4">View Message</button>
                  <button onClick={() => handleDelete(lead._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
