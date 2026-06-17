import React, { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';

export default function Portfolio() {
  const [showForm, setShowForm] = useState(false);
  
  const emptyPortfolio = {
    title: '', slug: '', category: 'Custom web', timeline: '', country: '', link: '', client: '',
    tags: [], techStack: [], images: [], description: '', purpose: '', challenge: '', solution: '', keyFeatures: ''
  };

  // Single portfolio state
  const [portfolio, setPortfolio] = useState(emptyPortfolio);

  const handleAddNew = () => {
    if (!showForm) {
      setPortfolio(emptyPortfolio);
      setTagInput('');
      setTechInput('');
    }
    setShowForm(!showForm);
  };

  const handleEdit = (item) => {
    setPortfolio({
      ...emptyPortfolio,
      ...item
    });
    setShowForm(true);
  };


  // Inputs for tags and tech stack (these remain separate as they are just UI helpers, not final data)
  const [tagInput, setTagInput] = useState('');
  const [techInput, setTechInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPortfolio(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    if (portfolio.category === 'Mobile app') {
      setPortfolio(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    } else {
      setPortfolio(prev => ({ ...prev, images: newImages }));
    }
    // reset input
    e.target.value = null;
  };

  const handleRemoveImage = (indexToRemove) => {
    setPortfolio(prev => {
      const newImages = [...prev.images];
      URL.revokeObjectURL(newImages[indexToRemove].preview);
      newImages.splice(indexToRemove, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setPortfolio(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setPortfolio(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleAddTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      setPortfolio(prev => ({ ...prev, techStack: [...prev.techStack, techInput.trim()] }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (indexToRemove) => {
    setPortfolio(prev => ({
      ...prev,
      techStack: prev.techStack.filter((_, index) => index !== indexToRemove)
    }));
  };

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
          onClick={handleAddNew}
          className="btn-kretoss px-4 py-2 rounded-md font-medium flex items-center"
        >
          {showForm ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {showForm ? 'Cancel' : 'Add Portfolio'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-6">{portfolio.slug ? 'Edit Portfolio' : 'Create New Portfolio'}</h2>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); console.log('Saved Portfolio Data:', portfolio); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input name="title" value={portfolio.title} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. Guestway" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input name="slug" value={portfolio.slug} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. guestway" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  name="category"
                  className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light"
                  value={portfolio.category}
                  onChange={handleChange}
                >
                  <option value="Custom web">Custom web</option>
                  <option value="Mobile app">Mobile app</option>
                  <option value="Shopify">Shopify</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Timeline</label>
                <input name="timeline" value={portfolio.timeline} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. 2-4 Months" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                <input name="country" value={portfolio.country} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. United States" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Link</label>
                <input name="link" value={portfolio.link} onChange={handleChange} type="url" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
                <input name="client" value={portfolio.client} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="e.g. John Doe" />
              </div>

              {/* Tags Input */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags (Press Enter to add)</label>
                <div className="w-full border border-slate-200 rounded-md p-2 flex flex-wrap gap-2 focus-within:border-brand-light bg-white">
                  {portfolio.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-50 text-brand-dark px-3 py-1 rounded-full text-sm flex items-center">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(index)} className="ml-2 hover:text-red-500 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input 
                    type="text" 
                    className="flex-1 outline-none min-w-[120px] bg-transparent p-1" 
                    placeholder={portfolio.tags.length === 0 ? "Add a tag (e.g. UI/UX)" : ""} 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                </div>
              </div>

              {/* Tech Stack Input */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tech Stack (Press Enter to add)</label>
                <div className="w-full border border-slate-200 rounded-md p-2 flex flex-wrap gap-2 focus-within:border-brand-light bg-white">
                  {portfolio.techStack.map((tech, index) => (
                    <span key={index} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm flex items-center">
                      {tech}
                      <button type="button" onClick={() => handleRemoveTech(index)} className="ml-2 hover:text-red-500 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input 
                    type="text" 
                    className="flex-1 outline-none min-w-[120px] bg-transparent p-1" 
                    placeholder={portfolio.techStack.length === 0 ? "Add tech stack (e.g. React)" : ""} 
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleAddTech}
                  />
                </div>
              </div>

              {/* Textareas */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea name="description" value={portfolio.description} onChange={handleChange} rows="3" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="Enter description"></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Purpose</label>
                <textarea name="purpose" value={portfolio.purpose} onChange={handleChange} rows="2" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="Enter purpose"></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Challenge</label>
                <textarea name="challenge" value={portfolio.challenge} onChange={handleChange} rows="2" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="Enter challenges"></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Solution</label>
                <textarea name="solution" value={portfolio.solution} onChange={handleChange} rows="2" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="Enter solution"></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Key Features</label>
                <textarea name="keyFeatures" value={portfolio.keyFeatures} onChange={handleChange} rows="3" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="Enter key features (bullet points or text)"></textarea>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Upload Image(s) {portfolio.category === 'Mobile app' && <span className="text-brand-light ml-1">(Multiple selection enabled for Mobile App)</span>}
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-brand-light transition-colors bg-slate-50 cursor-pointer">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <label className="relative cursor-pointer bg-slate-50 rounded-md font-medium text-brand-dark hover:text-brand-light focus-within:outline-none px-2">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" multiple={portfolio.category === 'Mobile app'} accept="image/*" onChange={handleImageChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </div>

                {/* Image Previews */}
                {portfolio.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {portfolio.images.map((img, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 shadow-sm aspect-video bg-slate-100">
                        <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button" 
                            onClick={() => handleRemoveImage(index)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform hover:scale-110 transition-transform shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" className="btn-kretoss px-8 py-2.5 rounded-md font-medium">
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
                    <button onClick={() => handleEdit(item)} className="text-brand-light hover:text-brand-dark font-medium">Edit</button>
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
