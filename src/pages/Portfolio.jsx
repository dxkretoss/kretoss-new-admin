import React, { useState, useEffect } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export default function Portfolio() {

  const emptyPortfolio = {
    title: '', slug: '', category: 'Custom web', timeline: '', country: '', link: '', client: '',
    appLinks: { android: '', ios: '' },
    tags: [], techStack: [], images: [], thumbnailImage: null, description: '', purpose: '', challenge: '', solution: '', keyFeatures: []
  };

  // Single portfolio state
  const [portfolio, setPortfolio] = useState(emptyPortfolio);
  const [portfoliosList, setPortfoliosList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const API_URL = import.meta.env.VITE_API_URL;
  const BACKEND_URL = API_URL.replace('/api', '');

  const isFormPage = location.pathname.includes('/portfolios/add') || location.pathname.includes('/portfolios/edit');
  const isEditMode = location.pathname.includes('/portfolios/edit');

  const fetchPortfolios = async () => {
    try {
      const response = await fetch(`${API_URL}/portfolios`);
      const data = await response.json();
      if (data.success) {
        setPortfoliosList(data.data);
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  useEffect(() => {
    if (isEditMode && id && portfoliosList.length > 0) {
      const itemToEdit = portfoliosList.find(p => p._id === id);
      if (itemToEdit) {
        let parsedFeatures = [];
        if (Array.isArray(itemToEdit.keyFeatures)) {
          parsedFeatures = itemToEdit.keyFeatures;
        } else if (typeof itemToEdit.keyFeatures === 'string') {
          try {
            parsedFeatures = JSON.parse(itemToEdit.keyFeatures);
          } catch (e) {
            // Fallback for old simple strings
            parsedFeatures = itemToEdit.keyFeatures ? [itemToEdit.keyFeatures] : [];
          }
        }

        setPortfolio({
          ...emptyPortfolio,
          ...itemToEdit,
          appLinks: itemToEdit.appLinks || { android: '', ios: '' },
          keyFeatures: parsedFeatures
        });
      }
    } else if (!isFormPage) {
      setPortfolio(emptyPortfolio);
      setTagInput('');
      setTechInput('');
    }
  }, [id, isEditMode, portfoliosList, isFormPage]);

  const handleAddNew = () => {
    navigate('/portfolios/add');
  };

  const handleEdit = (item) => {
    navigate(`/portfolios/edit/${item._id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this portfolio?")) return;
    try {
      const response = await fetch(`${API_URL}/portfolios/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPortfolios();
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    }
  };


  // Inputs for tags and tech stack (these remain separate as they are just UI helpers, not final data)
  const [tagInput, setTagInput] = useState('');
  const [techInput, setTechInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPortfolio(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'title') {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPortfolio(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
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

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPortfolio(prev => ({
      ...prev,
      thumbnailImage: {
        file,
        preview: URL.createObjectURL(file)
      }
    }));
    e.target.value = null;
  };

  const handleRemoveThumbnail = () => {
    setPortfolio(prev => {
      if (prev.thumbnailImage && prev.thumbnailImage.preview) {
        URL.revokeObjectURL(prev.thumbnailImage.preview);
      }
      return { ...prev, thumbnailImage: null };
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

  const handleAddFeature = () => {
    setPortfolio(prev => ({ ...prev, keyFeatures: [...prev.keyFeatures, ''] }));
  };

  const handleFeatureChange = (index, value) => {
    setPortfolio(prev => {
      const updatedFeatures = [...prev.keyFeatures];
      updatedFeatures[index] = value;
      return { ...prev, keyFeatures: updatedFeatures };
    });
  };

  const handleRemoveFeature = (index) => {
    setPortfolio(prev => {
      const updatedFeatures = [...prev.keyFeatures];
      updatedFeatures.splice(index, 1);
      return { ...prev, keyFeatures: updatedFeatures };
    });
  };

  const handleSavePortfolio = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Append text fields
      const textFields = ['title', 'slug', 'category', 'timeline', 'country', 'link', 'client', 'description', 'purpose', 'challenge', 'solution'];
      textFields.forEach(field => {
        if (portfolio[field]) formData.append(field, portfolio[field]);
      });

      // Append array fields
      formData.append('tags', JSON.stringify(portfolio.tags));
      formData.append('techStack', JSON.stringify(portfolio.techStack));
      formData.append('keyFeatures', JSON.stringify(portfolio.keyFeatures));
      formData.append('appLinks', JSON.stringify(portfolio.appLinks));

      // Append files
      if (portfolio.thumbnailImage && portfolio.thumbnailImage.file) {
        formData.append('thumbnailImage', portfolio.thumbnailImage.file);
      }

      if (portfolio.images && portfolio.images.length > 0) {
        portfolio.images.forEach(img => {
          if (img.file) {
            formData.append('images', img.file);
          }
        });
      }

      const url = portfolio._id
        ? `${API_URL}/portfolios/${portfolio._id}`
        : `${API_URL}/portfolios`;

      const method = portfolio._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData
      });

      if (response.ok) {
        fetchPortfolios();
        navigate('/portfolios');
      } else {
        const errorData = await response.json();
        console.error('Failed to save:', errorData.message);
        alert('Failed to save: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error saving portfolio:', error);
      alert('An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Portfolios</h1>
        <button
          onClick={isFormPage ? () => navigate('/portfolios') : handleAddNew}
          className="btn-kretoss px-4 py-2 rounded-md font-medium flex items-center"
        >
          {isFormPage ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {isFormPage ? 'Cancel' : 'Add Portfolio'}
        </button>
      </div>

      {isFormPage ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-6">{portfolio.slug ? 'Edit Portfolio' : 'Create New Portfolio'}</h2>
          <form className="space-y-6" onSubmit={handleSavePortfolio}>
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
                  <option value="Wordpress">Wordpress</option>
                  <option value="Bigcommerce">Bigcommerce</option>
                  <option value="Webdesign">Web Design</option>
                  <option value="UIUX">UI/UX</option>
                  <option value="Magento">Magento</option>
                  <option value="other">Other</option>
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
              {portfolio.category === 'Mobile app' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">iOS Link</label>
                    <input 
                      name="iosLink" 
                      value={portfolio.appLinks.ios} 
                      onChange={(e) => setPortfolio(prev => ({ ...prev, appLinks: { ...prev.appLinks, ios: e.target.value } }))} 
                      type="url" 
                      className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" 
                      placeholder="https://apps.apple.com/..." 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Android Link</label>
                    <input 
                      name="androidLink" 
                      value={portfolio.appLinks.android} 
                      onChange={(e) => setPortfolio(prev => ({ ...prev, appLinks: { ...prev.appLinks, android: e.target.value } }))} 
                      type="url" 
                      className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" 
                      placeholder="https://play.google.com/..." 
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Link</label>
                  <input name="link" value={portfolio.link} onChange={handleChange} type="url" className="w-full border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light" placeholder="https://..." />
                </div>
              )}
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Key Features</label>
                <div className="space-y-3">
                  {(Array.isArray(portfolio.keyFeatures) ? portfolio.keyFeatures : []).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 border border-slate-200 rounded-md px-4 py-2 focus:outline-none focus:border-brand-light"
                        placeholder="Enter a key feature"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="bg-red-50 text-red-500 hover:bg-red-100 p-2.5 rounded-md transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="flex items-center text-brand-dark hover:text-brand-light text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Feature
                  </button>
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Thumbnail Image
                </label>
                <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-brand-light transition-colors bg-slate-50 cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <span className="font-medium text-brand-dark hover:text-brand-light px-2">
                        Upload thumbnail
                      </span>
                      <input type="file" className="sr-only" accept="image/*" onChange={handleThumbnailChange} />
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 2MB</p>
                  </div>
                </label>

                {/* Thumbnail Preview */}
                {portfolio.thumbnailImage && (
                  <div className="mt-4 w-full">
                    <div className="relative group rounded-lg overflow-hidden border border-slate-200 shadow-sm aspect-video bg-slate-100">
                      <img src={portfolio.thumbnailImage.preview || `${BACKEND_URL}${portfolio.thumbnailImage}`} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={handleRemoveThumbnail}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform hover:scale-110 transition-transform shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Full Website/App Image Upload */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Website / App Image(s) <span className="text-brand-light ml-1">(Multiple enabled)</span>
                </label>
                <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-brand-light transition-colors bg-slate-50 cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <span className="font-medium text-brand-dark hover:text-brand-light px-2">
                        Upload a file
                      </span>
                      <input type="file" className="sr-only" multiple={true} accept="image/*" onChange={handleImageChange} />
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </label>

                {/* Image Previews */}
                {portfolio.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 gap-4">
                    {portfolio.images.map((img, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 shadow-sm aspect-video bg-slate-100">
                        <img src={img.preview || `${BACKEND_URL}${img}`} alt="Preview" className="w-full h-full object-cover" />
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
              <button type="submit" disabled={isLoading} className="btn-kretoss px-8 py-2.5 rounded-md font-medium disabled:opacity-50">
                {isLoading ? 'Saving...' : 'Save Portfolio'}
              </button>
            </div>
          </form>
        </div>
      ) : portfoliosList.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="text-slate-400">
            <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium text-slate-600">No portfolios added yet</p>
            <p className="text-sm">Click "Add Portfolio" to get started.</p>
          </div>
          <button onClick={handleAddNew} className="btn-kretoss px-4 py-2 rounded-md mt-2 font-medium">Add Portfolio</button>
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
              {portfoliosList.map((item, idx) => (
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
