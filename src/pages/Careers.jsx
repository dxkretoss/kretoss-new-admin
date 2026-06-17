import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function Careers() {
  const [showForm, setShowForm] = useState(false);

  // Static Data mimicking jobs.js
  const jobs = [
    { slug: 'mern-stack-developer', title: 'MERN Stack Developer', location: 'Ahmedabad', type: 'Full-Time', experience: '2-4 Years' },
    { slug: 'business-development-executive', title: 'Business Development Executive', location: 'Ahmedabad', type: 'Full-Time', experience: '1-3 Years' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Careers</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-[#44c7f6] to-[#0037f0] hover:opacity-90 text-white px-4 py-2 rounded-md font-medium flex items-center transition-opacity"
        >
          {showForm ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {showForm ? 'Cancel' : 'Add Job'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-6">Create New Job Posting</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                <input type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. Frontend Developer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. frontend-developer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. Ahmedabad" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light">
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. Development" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Experience Required</label>
                <input type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. 2-4 Years" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea rows="4" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="Job description..."></textarea>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" className="bg-gradient-to-r from-[#44c7f6] to-[#0037f0] text-white px-6 py-2 rounded-md font-medium hover:opacity-90 transition-opacity">
                Save Job
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Experience</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {jobs.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.title}</td>
                  <td className="px-6 py-4">{item.location}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-brand-dark px-2 py-1 rounded-md text-xs font-medium">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.experience}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-brand-light hover:text-brand-dark font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
