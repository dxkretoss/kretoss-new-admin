import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export default function Careers() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const API_URL = import.meta.env.VITE_API_URL;

  const isFormPage = location.pathname.includes('/careers/add') || location.pathname.includes('/careers/edit');
  const isEditMode = location.pathname.includes('/careers/edit');

  const emptyJob = {
    title: '', slug: '', location: '', type: 'Full-Time', category: '', experience: '', description: '',
    responsibilities: [], requirements: [], niceToHave: [], status: 'Active'
  };

  const [job, setJob] = useState(emptyJob);
  const [jobsList, setJobsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [respInput, setRespInput] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [niceInput, setNiceInput] = useState('');

  const fetchCareers = async () => {
    try {
      const response = await fetch(`${API_URL}/careers`);
      const data = await response.json();
      if (data.success) {
        setJobsList(data.data);
      }
    } catch (error) {
      console.error('Error fetching careers:', error);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  useEffect(() => {
    if (isEditMode && id && jobsList.length > 0) {
      const itemToEdit = jobsList.find(j => j.slug === id);
      if (itemToEdit) {
        setJob({
          ...emptyJob,
          ...itemToEdit,
          responsibilities: itemToEdit.responsibilities || [],
          requirements: itemToEdit.requirements || [],
          niceToHave: itemToEdit.niceToHave || []
        });
      }
    } else if (!isFormPage) {
      setJob(emptyJob);
      setRespInput('');
      setReqInput('');
      setNiceInput('');
    }
  }, [id, isEditMode, isFormPage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'title') {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  const handleEdit = (item) => {
    navigate(`/careers/edit/${item.slug}`);
  };

  const handleAddNew = () => {
    navigate('/careers/add');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      const response = await fetch(`${API_URL}/careers/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchCareers();
      }
    } catch (error) {
      console.error('Error deleting career:', error);
    }
  };

  // Array Handlers
  const handleAddArrayItem = (e, field, input, setInput) => {
    if (input.trim()) {
      e.preventDefault();
      setJob(prev => ({ ...prev, [field]: [...prev[field], input.trim()] }));
      setInput('');
    }
  };

  const handleRemoveArrayItem = (field, indexToRemove) => {
    setJob(prev => ({
      ...prev,
      [field]: prev[field].filter((_, index) => index !== indexToRemove)
    }));
  };

  const renderArrayInput = (label, field, inputState, setInputState, placeholder) => (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="space-y-3 p-4 border border-slate-100 rounded-lg bg-white shadow-sm">
        {job[field].length > 0 && (
          <ul className="flex flex-col gap-2 mb-4">
            {job[field].map((item, index) => (
              <li key={index} className="flex justify-between items-start p-3 bg-slate-50 rounded-md border border-slate-100">
                <span className="text-sm text-slate-700">{item}</span>
                <button type="button" onClick={() => handleRemoveArrayItem(field, index)} className="ml-3 mt-0.5 text-red-400 hover:text-red-600 transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-3">
          <input 
            type="text" 
            className="flex-1 border border-slate-200 rounded-md px-4 py-2.5 focus:outline-none focus:border-brand-light text-sm" 
            placeholder={placeholder} 
            value={inputState}
            onChange={(e) => setInputState(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddArrayItem(e, field, inputState, setInputState);
              }
            }}
          />
          <button 
            type="button"
            onClick={(e) => handleAddArrayItem(e, field, inputState, setInputState)}
            className="btn-kretoss px-6 py-2.5 rounded-md font-medium text-sm flex-shrink-0"
          >
            Add Field
          </button>
        </div>
      </div>
    </div>
  );

  const handleSaveJob = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = job._id 
        ? `${API_URL}/careers/${job._id}`
        : `${API_URL}/careers`;
        
      const method = job._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(job)
      });

      if (response.ok) {
        fetchCareers();
        navigate('/careers');
      } else {
        const errorData = await response.json();
        console.error('Failed to save:', errorData.message);
        alert('Failed to save: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error saving career:', error);
      alert('An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  // Array Handlers

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Careers</h1>
        <button 
          onClick={isFormPage ? () => navigate('/careers') : handleAddNew}
          className="btn-kretoss px-4 py-2 rounded-md font-medium flex items-center"
        >
          {isFormPage ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {isFormPage ? 'Cancel' : 'Add Job'}
        </button>
      </div>

      {isFormPage ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-6">{job.slug ? 'Edit Job Posting' : 'Create New Job Posting'}</h2>
          <form className="space-y-8" onSubmit={handleSaveJob}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                <input name="title" value={job.title} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. Frontend Developer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input name="slug" value={job.slug} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. frontend-developer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input name="location" value={job.location} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. Ahmedabad" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select name="type" value={job.type} onChange={handleChange} className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light">
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input name="category" value={job.category} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. Development" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Experience Required</label>
                <input name="experience" value={job.experience} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. 2-4 Years" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select name="status" value={job.status || 'Active'} onChange={handleChange} className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea name="description" value={job.description} onChange={handleChange} rows="4" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="Job description..."></textarea>
              </div>

              {renderArrayInput('Responsibilities', 'responsibilities', respInput, setRespInput, 'Add a responsibility...')}
              
              {renderArrayInput('Requirements', 'requirements', reqInput, setReqInput, 'Add a requirement...')}
              
              {renderArrayInput('Nice to Have', 'niceToHave', niceInput, setNiceInput, 'Add a nice-to-have skill...')}

            </div>
            <div className="flex justify-end border-t border-slate-100 pt-6">
              <button type="submit" disabled={isLoading} className="btn-kretoss px-8 py-3 rounded-md font-medium text-base disabled:opacity-50">
                {isLoading ? 'Saving...' : 'Save Job Posting'}
              </button>
            </div>
          </form>
        </div>
      ) : jobsList.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="text-slate-400">
            <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium text-slate-600">No jobs added yet</p>
          </div>
          <button onClick={handleAddNew} className="btn-kretoss px-4 py-2 rounded-md mt-2 font-medium">Add Job</button>
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
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {jobsList.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.title}</td>
                  <td className="px-6 py-4">{item.location}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-brand-dark px-2 py-1 rounded-md text-xs font-medium">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.experience}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${item.status === 'Inactive' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {item.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(item)} className="text-brand-light hover:text-brand-dark font-medium mr-4">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
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
