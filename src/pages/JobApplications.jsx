import React from 'react';
import { Paperclip, Phone, Mail } from 'lucide-react';

export default function JobApplications() {
  const apps = [
    { id: 1, name: 'Alice Walker', email: 'alice@example.com', phone: '123-456-7890', role: 'MERN Stack Developer', exp: '3-5 Years', date: '2026-06-17' },
    { id: 2, name: 'Bob Carter', email: 'bob@example.com', phone: '098-765-4321', role: 'Business Development', exp: '1-2 Years', date: '2026-06-16' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Job Applications</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
            <tr>
              <th className="px-6 py-4 font-medium">Candidate Info</th>
              <th className="px-6 py-4 font-medium">Applied Role</th>
              <th className="px-6 py-4 font-medium">Experience</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
            {apps.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{app.name}</div>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <Mail className="w-3 h-3 mr-1" /> {app.email}
                  </div>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <Phone className="w-3 h-3 mr-1" /> {app.phone}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-50 text-brand-dark px-2 py-1 rounded-md text-xs font-medium">
                    {app.role}
                  </span>
                </td>
                <td className="px-6 py-4">{app.exp}</td>
                <td className="px-6 py-4">{app.date}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button className="text-brand-light hover:text-brand-dark font-medium inline-flex items-center">
                    <Paperclip className="w-4 h-4 mr-1" /> Resume
                  </button>
                  <button className="text-emerald-500 hover:text-emerald-600 font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
