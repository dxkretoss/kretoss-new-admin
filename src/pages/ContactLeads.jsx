import React from 'react';
import { Mail } from 'lucide-react';

export default function ContactLeads() {
  const leads = [
    { id: 1, name: 'John Doe', email: 'john@example.com', subject: 'Project Inquiry', date: '2026-06-17' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', subject: 'App Development', date: '2026-06-16' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', subject: 'Web Design Quote', date: '2026-06-15' },
  ];

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
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Subject</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{lead.name}</td>
                <td className="px-6 py-4 flex items-center text-brand-light">
                  <Mail className="w-4 h-4 mr-2" />
                  {lead.email}
                </td>
                <td className="px-6 py-4">{lead.subject}</td>
                <td className="px-6 py-4">{lead.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-brand-light hover:text-brand-dark font-medium">View Message</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
