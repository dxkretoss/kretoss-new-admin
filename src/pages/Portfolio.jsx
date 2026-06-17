import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function Portfolio() {
  const [showForm, setShowForm] = useState(false);

  // Static Data mimicking portfolio.js
  const portfolios = [
    { slug: 'guestway', title: 'Guestway', category: 'Custom web', timeline: '2-4 Months' },
    { slug: 'nexthunt', title: 'NextHunt', category: 'Custom web', timeline: '2-4 Months' },
    { slug: 'my100days', title: 'My100Days', category: 'Mobile app', timeline: '2-4 Months' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Portfolios</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-[#44c7f6] to-[#0037f0] hover:opacity-90 text-white px-4 py-2 rounded-md font-medium flex items-center transition-opacity"
        >
          {showForm ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {showForm ? 'Cancel' : 'Add Portfolio'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-6">Create New Portfolio</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. Guestway" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. guestway" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light">
                  <option>Custom web</option>
                  <option>Mobile app</option>
                  <option>Shopify</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Timeline</label>
                <input type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. 2-4 Months" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea rows="3" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="Enter description"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tech Stack</label>
                <input type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. Angular + Node.js" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <input type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="/portfolio/custom/Guestway.webp" />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" className="bg-gradient-to-r from-[#44c7f6] to-[#0037f0] text-white px-6 py-2 rounded-md font-medium hover:opacity-90 transition-opacity">
                Save Portfolio
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
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Timeline</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {portfolios.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.title}</td>
                  <td className="px-6 py-4">{item.slug}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-brand-dark px-2 py-1 rounded-md text-xs font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.timeline}</td>
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
