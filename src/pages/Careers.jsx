import React, { useState, useEffect } from 'react';
import { Plus, X, ArrowLeft, Upload } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Careers() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const API_URL = import.meta.env.VITE_API_URL;

  const isFormPage = location.pathname.includes('/careers/add') || location.pathname.includes('/careers/edit');
  const isEditMode = location.pathname.includes('/careers/edit');

  const emptyJob = {
    title: '', slug: '', location: '', type: 'Full-Time', category: '', experience: '', shortSummary: '', description: '',
    responsibilities: [], requirements: [], niceToHave: [], status: 'Active'
  };

  const [job, setJob] = useState(emptyJob);
  const [jobsList, setJobsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
      setImageFile(null);
      setImagePreview(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, isEditMode, isFormPage, jobsList]);

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

      const formData = new FormData();
      Object.keys(job).forEach(key => {
        if (key === 'responsibilities' || key === 'requirements' || key === 'niceToHave') {
          formData.append(key, JSON.stringify(job[key]));
        } else if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v') {
          formData.append(key, job[key]);
        }
      });

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(url, {
        method,
        body: formData
      });

      if (response.ok) {
        toast.success(isEditMode ? 'Job posting updated successfully!' : 'Job posting created successfully!');
        fetchCareers();
        navigate('/careers');
      } else {
        const errorData = await response.json();
        toast.error('Failed to save: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error saving career:', error);
      toast.error('An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {!isFormPage && (
        <div className="flex justify-between items-end pb-6 border-b-2 border-slate-200/50 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Careers</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Manage job postings and career opportunities.</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="btn-kretoss px-6 py-3 rounded-xl text-sm font-semibold flex items-center shadow-md transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Job
          </button>
        </div>
      )}

      {isFormPage ? (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-6 flex items-center gap-4">
            <button type="button" onClick={() => navigate('/careers')} className="p-2 hover:bg-slate-200/60 rounded-full transition-colors group">
              <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{job.slug ? 'Edit Job Posting' : 'Create New Job Posting'}</h2>
              <p className="text-sm text-slate-500 mt-1">Fill in the details below to {job.slug ? 'update this' : 'add a new'} career opportunity.</p>
            </div>
          </div>
          <form className="p-8 space-y-12" onSubmit={handleSaveJob}>
            
            {/* Section: Basic Details */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 mb-6">
                <h3 className="text-lg font-bold text-slate-800">1. Basic Details</h3>
                <p className="text-sm text-slate-500">General information about the role.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title</label>
                  <input name="title" value={job.title} onChange={handleChange} type="text" className="input-premium w-full" placeholder="e.g. Frontend Developer" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Slug</label>
                  <input name="slug" value={job.slug} onChange={handleChange} type="text" className="input-premium w-full bg-slate-100/50" placeholder="e.g. frontend-developer" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                  <input name="location" value={job.location} onChange={handleChange} type="text" className="input-premium w-full" placeholder="e.g. Ahmedabad" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
                  <select name="type" value={job.type} onChange={handleChange} className="input-premium w-full cursor-pointer">
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select name="status" value={job.status || 'Active'} onChange={handleChange} className="input-premium w-full cursor-pointer">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <input name="category" value={job.category} onChange={handleChange} type="text" className="input-premium w-full" placeholder="e.g. Development" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Experience Required</label>
                  <input name="experience" value={job.experience} onChange={handleChange} type="text" className="input-premium w-full" placeholder="e.g. 2-4 Years" />
                </div>
              </div>
          </div>

          {/* Section: Image Upload */}
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3 mb-6">
              <h3 className="text-lg font-bold text-slate-800">2. Career Image</h3>
              <p className="text-sm text-slate-500">Visual representation of this career posting.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Main Image</label>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 relative border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:bg-brand-light/5 hover:border-brand-light transition-all text-center cursor-pointer group flex flex-col justify-center items-center min-h-[160px]">
                  <input type="file" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-3">
                    <Upload className="w-6 h-6 text-brand-dark" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Click or drag image to upload</span>
                </div>
                {(imagePreview || job.image) && (
                  <div className="w-full sm:w-1/2 lg:w-1/3">
                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-video h-full min-h-[160px] bg-slate-100">
                      <img src={imagePreview || (job.image.startsWith('/') ? `http://localhost:5000${job.image}` : job.image)} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Job Description & Details */}
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3 mb-6">
              <h3 className="text-lg font-bold text-slate-800">3. Job Description & Details</h3>
              <p className="text-sm text-slate-500">Provide an overview and specific requirements.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Short Summary</label>
                <textarea name="shortSummary" value={job.shortSummary || ''} onChange={handleChange} rows="2" className="input-premium resize-y" placeholder="Brief summary of the role..."></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Description</label>
                <textarea name="description" value={job.description} onChange={handleChange} rows="4" className="input-premium resize-y" placeholder="Detailed job description..."></textarea>
              </div>

              {renderArrayInput('Responsibilities', 'responsibilities', respInput, setRespInput, 'Add a responsibility...')}
              
              {renderArrayInput('Requirements', 'requirements', reqInput, setReqInput, 'Add a requirement...')}
              
              {renderArrayInput('Nice to Have', 'niceToHave', niceInput, setNiceInput, 'Add a nice-to-have skill...')}
            </div>
          </div>
            
            <div className="flex justify-end pt-6 border-t border-slate-100 bg-slate-50/50 -mx-8 -mb-8 px-8 py-6">
              <button type="button" onClick={() => navigate('/careers')} className="btn-kretoss !bg-none !bg-white !text-slate-600 !border-slate-200 hover:!bg-slate-50 hover:!border-slate-300 mr-4 px-8 py-3 rounded-xl font-semibold shadow-sm transition-all">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="btn-kretoss px-10 py-3 rounded-xl text-base font-semibold disabled:opacity-50 min-w-[200px]">
                {isLoading ? 'Saving...' : 'Save Job Posting'}
              </button>
            </div>
          </form>
        </div>
      ) : jobsList.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-16 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <Plus className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No jobs added yet</h3>
          <p className="text-slate-500 font-medium">Create your first job posting to start hiring.</p>
          <button onClick={handleAddNew} className="btn-kretoss px-6 py-3 rounded-xl mt-4 font-semibold shadow-md">Add Job</button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Experience</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {jobsList.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-3 font-bold text-slate-800">{item.title}</td>
                  <td className="px-6 py-3 text-slate-500 font-medium">{item.location}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide bg-blue-50 text-brand-dark border border-blue-100/50">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-500 font-medium">{item.experience}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide border ${item.status === 'Inactive' ? 'bg-red-50 text-red-600 border-red-100/50' : 'bg-emerald-50 text-emerald-600 border-emerald-100/50'}`}>
                      {item.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => handleEdit(item)} className="text-brand-light hover:text-brand-dark font-bold mr-5 transition-colors">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="text-slate-400 hover:text-red-500 font-bold transition-colors">Delete</button>
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
