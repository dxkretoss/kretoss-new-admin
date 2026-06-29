import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

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
  const [categories, setCategories] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Delete confirmation states
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

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

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/portfolio-categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchPortfolios();
    fetchCategories();
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

  const confirmDelete = (id) => {
    setPortfolioToDelete(id);
  };

  const handleDelete = async () => {
    if (!portfolioToDelete) return;
    try {
      const response = await fetch(`${API_URL}/portfolios/${portfolioToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPortfolios();
        setPortfolioToDelete(null);
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
        toast.success(isEditMode ? 'Portfolio updated successfully!' : 'Portfolio created successfully!');
        fetchPortfolios();
        navigate('/portfolios');
      } else {
        const errorData = await response.json();
        toast.error('Failed to save: ' + errorData.message);
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const response = await fetch(`${API_URL}/portfolio-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Category added successfully!');
        setNewCategoryName('');
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const confirmDeleteCategory = (id) => {
    setCategoryToDelete(id);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      const response = await fetch(`${API_URL}/portfolio-categories/${categoryToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        fetchCategories();
        setCategoryToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {!isFormPage && (
        <div className="flex justify-between items-end pb-6 border-b-2 border-slate-200/50 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Portfolios</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Manage and organize your portfolio projects.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="btn-kretoss-outline px-6 py-3 rounded-xl text-sm font-semibold flex items-center shadow-sm transition-all border-2 border-slate-200 hover:border-slate-300"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Category
            </button>
            <button
              onClick={handleAddNew}
              className="btn-kretoss px-6 py-3 rounded-xl text-sm font-semibold flex items-center shadow-md transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Portfolio
            </button>
          </div>
        </div>
      )}

      {isFormPage ? (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-6 flex items-center gap-4">
            <button type="button" onClick={() => navigate('/portfolios')} className="p-2 hover:bg-slate-200/60 rounded-full transition-colors group">
              <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{portfolio.slug ? 'Edit Portfolio' : 'Create New Portfolio'}</h2>
              <p className="text-sm text-slate-500 mt-1">Fill in the details below to {portfolio.slug ? 'update this' : 'add a new'} portfolio item.</p>
            </div>
          </div>
          <form className="p-8 space-y-12" onSubmit={handleSavePortfolio}>

            {/* Section: Basic Information */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 mb-6">
                <h3 className="text-lg font-bold text-slate-800">1. Basic Information</h3>
                <p className="text-sm text-slate-500">General details about the project.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                  <input name="title" value={portfolio.title} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. Guestway" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Slug</label>
                  <input name="slug" value={portfolio.slug} onChange={handleChange} type="text" className="input-premium bg-slate-100/50" placeholder="e.g. guestway" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <select
                    name="category"
                    className="input-premium cursor-pointer"
                    value={portfolio.category}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Timeline</label>
                  <input name="timeline" value={portfolio.timeline} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. 2-4 Months" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
                  <input name="country" value={portfolio.country} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. United States" />
                </div>
                {portfolio.category === 'Mobile app' ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">iOS Link</label>
                      <input
                        name="iosLink"
                        value={portfolio.appLinks.ios}
                        onChange={(e) => setPortfolio(prev => ({ ...prev, appLinks: { ...prev.appLinks, ios: e.target.value } }))}
                        type="url"
                        className="input-premium"
                        placeholder="https://apps.apple.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Android Link</label>
                      <input
                        name="androidLink"
                        value={portfolio.appLinks.android}
                        onChange={(e) => setPortfolio(prev => ({ ...prev, appLinks: { ...prev.appLinks, android: e.target.value } }))}
                        type="url"
                        className="input-premium"
                        placeholder="https://play.google.com/..."
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Link</label>
                    <input name="link" value={portfolio.link} onChange={handleChange} type="url" className="input-premium" placeholder="https://..." />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Client</label>
                  <input name="client" value={portfolio.client} onChange={handleChange} type="text" className="input-premium" placeholder="e.g. John Doe" />
                </div>
              </div>
            </div>

            {/* Section: Technologies & Tags */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 mb-6">
                <h3 className="text-lg font-bold text-slate-800">2. Technologies & Categorization</h3>
                <p className="text-sm text-slate-500">Skills, tags, and technologies used.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tags Input */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tags (Press Enter to add)</label>
                  <div className="w-full border border-slate-200 bg-slate-50 rounded-xl p-2.5 flex flex-wrap gap-2 focus-within:border-brand-light focus-within:ring-4 focus-within:ring-brand-light/10 focus-within:bg-white transition-all">
                    {portfolio.tags.map((tag, index) => (
                      <span key={index} className="bg-brand-light/10 text-brand-dark px-3 py-1.5 rounded-lg text-sm flex items-center font-medium">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(index)} className="ml-2 hover:text-red-500 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="flex-1 outline-none min-w-[120px] bg-transparent px-2"
                      placeholder={portfolio.tags.length === 0 ? "Add a tag (e.g. UI/UX)" : ""}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                  </div>
                </div>

                {/* Tech Stack Input */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tech Stack (Press Enter to add)</label>
                  <div className="w-full border border-slate-200 bg-slate-50 rounded-xl p-2.5 flex flex-wrap gap-2 focus-within:border-brand-light focus-within:ring-4 focus-within:ring-brand-light/10 focus-within:bg-white transition-all">
                    {portfolio.techStack.map((tech, index) => (
                      <span key={index} className="bg-slate-200/50 text-slate-700 px-3 py-1.5 rounded-lg text-sm flex items-center font-medium">
                        {tech}
                        <button type="button" onClick={() => handleRemoveTech(index)} className="ml-2 hover:text-red-500 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="flex-1 outline-none min-w-[120px] bg-transparent px-2"
                      placeholder={portfolio.techStack.length === 0 ? "Add tech stack (e.g. React)" : ""}
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={handleAddTech}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Project Content */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 mb-6">
                <h3 className="text-lg font-bold text-slate-800">3. Project Content</h3>
                <p className="text-sm text-slate-500">Detailed descriptions and challenges.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Textareas */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <textarea name="description" value={portfolio.description} onChange={handleChange} rows="3" className="input-premium resize-y" placeholder="Enter description"></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Purpose</label>
                  <textarea name="purpose" value={portfolio.purpose} onChange={handleChange} rows="2" className="input-premium resize-y" placeholder="Enter purpose"></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Challenge</label>
                  <textarea name="challenge" value={portfolio.challenge} onChange={handleChange} rows="2" className="input-premium resize-y" placeholder="Enter challenges"></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Solution</label>
                  <textarea name="solution" value={portfolio.solution} onChange={handleChange} rows="2" className="input-premium resize-y" placeholder="Enter solution"></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Key Features</label>
                  <div className="space-y-4">
                    {(Array.isArray(portfolio.keyFeatures) ? portfolio.keyFeatures : []).map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          className="input-premium"
                          placeholder="Enter a key feature"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-all duration-300 flex-shrink-0 border border-red-100 hover:border-red-500 hover:shadow-md"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="flex items-center text-brand-dark hover:text-brand-light bg-brand-light/5 hover:bg-brand-light/10 px-4 py-2 rounded-xl text-sm font-semibold transition-all w-fit"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Feature
                    </button>
                  </div>
                </div>

                {/* Thumbnail Upload */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Thumbnail Image
                  </label>
                  <label className="mt-1 flex justify-center px-6 py-10 border-2 border-slate-300 border-dashed rounded-2xl hover:border-brand-light transition-all bg-slate-50 hover:bg-brand-light/5 cursor-pointer relative group">
                    <div className="space-y-2 text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6 text-brand-light" />
                      </div>
                      <div className="flex text-sm text-slate-600 justify-center font-medium">
                        <span className="text-brand-dark px-1">Upload a file</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={handleThumbnailChange} />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">PNG, JPG, WEBP up to 2MB</p>
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Website / App Image(s) <span className="text-brand-light ml-1 font-normal">(Multiple enabled)</span>
                  </label>
                  <label className="mt-1 flex justify-center px-6 py-10 border-2 border-slate-300 border-dashed rounded-2xl hover:border-brand-light transition-all bg-slate-50 hover:bg-brand-light/5 cursor-pointer relative group">
                    <div className="space-y-2 text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6 text-brand-dark" />
                      </div>
                      <div className="flex text-sm text-slate-600 justify-center font-medium">
                        <span className="text-brand-dark px-1">Upload files</span>
                        <input type="file" className="sr-only" multiple={true} accept="image/*" onChange={handleImageChange} />
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">PNG, JPG, WEBP up to 10MB</p>
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
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 bg-slate-50/50 -mx-8 -mb-8 px-8 py-6">
              <button type="button" onClick={() => navigate('/portfolios')} className="btn-kretoss !bg-none !bg-white !text-slate-600 !border-slate-200 hover:!bg-slate-50 hover:!border-slate-300 mr-4 px-8 py-3 rounded-xl font-semibold shadow-sm transition-all">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="btn-kretoss px-10 py-3 rounded-xl text-base font-semibold disabled:opacity-50 min-w-[200px]">
                {isLoading ? 'Saving...' : 'Save Portfolio'}
              </button>
            </div>
          </form>
        </div>
      ) : portfoliosList.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-16 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <Plus className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No portfolios added yet</h3>
          <p className="text-slate-500 font-medium">Create your first portfolio to showcase your work.</p>
          <button onClick={handleAddNew} className="btn-kretoss px-6 py-3 rounded-xl mt-4 font-semibold shadow-md">Add Portfolio</button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3.5">Project</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Timeline</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-sm">
              {portfoliosList.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        {item.thumbnailImage ? (
                          <img src={`${BACKEND_URL}${item.thumbnailImage}`} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg">
                            {item.title.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm group-hover:text-brand-dark transition-colors">{item.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-medium">{item.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide bg-blue-50 text-brand-dark border border-blue-100/50">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-500 font-medium text-sm">{item.timeline || '-'}</td>
                  <td className="px-6 py-3 text-right text-sm">
                    <button onClick={() => handleEdit(item)} className="text-brand-light hover:text-brand-dark font-bold mr-5 transition-colors">Edit</button>
                    <button onClick={() => confirmDelete(item._id)} className="text-slate-400 hover:text-red-500 font-bold transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">Manage Categories</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-200/50 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); }}
                  className="input-premium flex-1"
                  placeholder="New Category Name"
                />
                <button
                  onClick={handleAddCategory}
                  className="btn-kretoss px-6 py-2.5 rounded-xl font-semibold shadow-md hover:-translate-y-0.5 transition-all whitespace-nowrap"
                >
                  Add
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {categories.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm py-4">No categories added yet.</p>
                ) : categories.map((cat) => (
                  <div key={cat._id} className="flex justify-between items-center bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group">
                    <span className="font-medium text-slate-700">{cat.name}</span>
                    <button
                      onClick={() => confirmDeleteCategory(cat._id)}
                      className="text-red-400 hover:text-white border-2 border-red-100 hover:border-red-500 p-1.5 rounded-lg hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center justify-center shadow-sm"
                      title="Delete Category"
                    >
                      <X className="w-4 h-4" strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Category?</h3>
            <p className="text-slate-500 text-sm mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="px-6 py-2.5 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 shadow-md transition-all hover:-translate-y-0.5"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Portfolio Confirmation Modal */}
      {portfolioToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Portfolio?</h3>
            <p className="text-slate-500 text-sm mb-6">Are you sure you want to delete this portfolio project? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setPortfolioToDelete(null)}
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
