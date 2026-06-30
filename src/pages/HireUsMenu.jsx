import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, X, Upload, Save, Trash2, LayoutDashboard, ArrowRight, ChevronRight, ArrowLeft } from 'lucide-react';

export default function HireUsMenu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState({ categories: [], bottomLinks: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = searchParams.get('edit') === 'true';
  const setIsEditing = (editing) => {
    if (editing) {
      setSearchParams({ edit: 'true' });
    } else {
      setSearchParams({});
    }
  };

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'category' | 'item' | 'bottomLink', cIndex, iIndex, lIndex }

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/hire-us-menu');
      const data = await response.json();
      if (data.success && data.data) {
        setMenu(data.data);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // -- Handlers for Categories --
  const handleAddCategory = () => {
    setMenu(prev => ({
      ...prev,
      categories: [...prev.categories, { title: '', items: [] }]
    }));
  };

  const handleRemoveCategory = (cIndex) => {
    setDeleteTarget({ type: 'category', cIndex });
  };

  const executeRemoveCategory = (cIndex) => {
    setMenu(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== cIndex)
    }));
    setDeleteTarget(null);
  };

  const handleCategoryChange = (e, cIndex) => {
    const { value } = e.target;
    setMenu(prev => {
      const categories = [...prev.categories];
      categories[cIndex] = { ...categories[cIndex], title: value };
      return { ...prev, categories };
    });
  };

  // -- Handlers for Category Items --
  const handleAddItem = (cIndex) => {
    setMenu(prev => {
      const categories = [...prev.categories];
      const category = { ...categories[cIndex] };
      category.items = [...(category.items || []), { name: '', link: '', icon: '' }];
      categories[cIndex] = category;
      return { ...prev, categories };
    });
  };

  const handleRemoveItem = (cIndex, iIndex) => {
    setDeleteTarget({ type: 'item', cIndex, iIndex });
  };

  const executeRemoveItem = (cIndex, iIndex) => {
    setMenu(prev => {
      const categories = [...prev.categories];
      const category = { ...categories[cIndex] };
      category.items = category.items.filter((_, i) => i !== iIndex);
      categories[cIndex] = category;
      return { ...prev, categories };
    });
    setDeleteTarget(null);
  };

  const handleItemChange = (e, cIndex, iIndex, field) => {
    const { value } = e.target;
    setMenu(prev => {
      const categories = [...prev.categories];
      const category = { ...categories[cIndex] };
      const items = [...category.items];
      items[iIndex] = { ...items[iIndex], [field]: value };
      category.items = items;
      categories[cIndex] = category;
      return { ...prev, categories };
    });
  };

  const handleItemIconUpload = (e, cIndex, iIndex) => {
    const file = e.target.files[0];
    if (file) {
      setMenu(prev => {
        const categories = [...prev.categories];
        const category = { ...categories[cIndex] };
        const items = [...category.items];
        items[iIndex] = { ...items[iIndex], icon: Object.assign(file, { preview: URL.createObjectURL(file) }) };
        category.items = items;
        categories[cIndex] = category;
        return { ...prev, categories };
      });
    }
  };

  // -- Handlers for Bottom Links --
  const handleAddBottomLink = () => {
    setMenu(prev => ({
      ...prev,
      bottomLinks: [...(prev.bottomLinks || []), { name: '', link: '' }]
    }));
  };

  const handleRemoveBottomLink = (index) => {
    setDeleteTarget({ type: 'bottomLink', lIndex: index });
  };

  const executeRemoveBottomLink = (index) => {
    setMenu(prev => ({
      ...prev,
      bottomLinks: prev.bottomLinks.filter((_, i) => i !== index)
    }));
    setDeleteTarget(null);
  };

  const handleBottomLinkChange = (e, index, field) => {
    const { value } = e.target;
    setMenu(prev => {
      const bottomLinks = [...prev.bottomLinks];
      bottomLinks[index] = { ...bottomLinks[index], [field]: value };
      return { ...prev, bottomLinks };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      const payload = JSON.parse(JSON.stringify(menu));

      // Extract files from categories
      if (menu.categories && Array.isArray(menu.categories)) {
        menu.categories.forEach((cat, cIndex) => {
          if (cat.items && Array.isArray(cat.items)) {
            cat.items.forEach((item, iIndex) => {
              if (item.icon && typeof item.icon !== 'string' && item.icon.name) {
                // Fieldname matches controller logic: category_0_item_1_icon
                formData.append(`category_${cIndex}_item_${iIndex}_icon`, item.icon);
                delete payload.categories[cIndex].items[iIndex].icon;
              }
            });
          }
        });
      }

      formData.append('categories', JSON.stringify(payload.categories || []));
      formData.append('bottomLinks', JSON.stringify(payload.bottomLinks || []));

      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/hire-us-menu', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        toast.success('Menu saved successfully!');
        fetchMenu();
      } else {
        const errorData = await response.json();
        toast.error('Failed to save: ' + errorData.message);
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('An error occurred while saving.');
    } finally {
      setIsSaving(false);
      setIsEditing(false); // Exit edit mode after saving
    }
  };

  const executeDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'category') executeRemoveCategory(deleteTarget.cIndex);
    if (deleteTarget.type === 'item') executeRemoveItem(deleteTarget.cIndex, deleteTarget.iIndex);
    if (deleteTarget.type === 'bottomLink') executeRemoveBottomLink(deleteTarget.lIndex);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading Menu Settings...</div>;
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end pb-6 border-b-2 border-slate-200/50 mb-8">
        <div className="flex items-start gap-4">
          {isEditing && (
            <button type="button" onClick={() => setIsEditing(false)} className="mt-0.5 p-2 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 rounded-xl transition-all group">
              <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-brand-dark" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Hire Us Mega Menu</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Configure the categories and links displayed in the Hire Us dropdown menu.</p>
          </div>
        </div>
        {isEditing ? (
          <button type="button" onClick={handleSave} disabled={isSaving} className="btn-kretoss px-6 py-3 rounded-xl text-sm font-semibold flex items-center shadow-md transition-all hover:-translate-y-0.5">
            <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Saving...' : 'Save Menu'}
          </button>
        ) : (
          <button type="button" onClick={() => setIsEditing(true)} className="btn-kretoss px-6 py-3 rounded-xl text-sm font-semibold flex items-center shadow-md transition-all hover:-translate-y-0.5">
            Edit Menu
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        {isEditing ? (
          <form className="p-8 space-y-12" onSubmit={handleSave}>

            {/* Categories Section */}
            <div className="space-y-6 border-b border-slate-100 pb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-blue-500" /> Menu Categories (Columns)</h3>
                {isEditing && <button type="button" onClick={handleAddCategory} className="btn-kretoss px-4 py-2 rounded-xl text-sm"><Plus className="w-4 h-4 inline mr-1" /> Add Category</button>}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {menu.categories.map((category, cIndex) => (
                  <div key={cIndex} className="bg-slate-50 rounded-2xl p-6 relative border border-slate-200 shadow-sm">
                    {isEditing && <button type="button" onClick={() => handleRemoveCategory(cIndex)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>}

                    <div className="mb-6 mr-10">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Category Title</label>
                      {isEditing ? (
                        <input type="text" value={category.title} onChange={(e) => handleCategoryChange(e, cIndex)} placeholder="e.g. Frontend Developers" className="input-premium w-full text-lg font-bold text-slate-800" required />
                      ) : (
                        <div className="text-lg font-bold text-slate-800 py-2">{category.title || '-'}</div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <label className="text-sm font-bold text-slate-700">Roles / Items</label>
                        {isEditing && <button type="button" onClick={() => handleAddItem(cIndex)} className="text-blue-500 hover:text-blue-700 text-sm font-bold flex items-center"><Plus className="w-4 h-4 mr-1" /> Add Item</button>}
                      </div>

                      {category.items.map((item, iIndex) => (
                        <div key={iIndex} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative pr-12 group">
                          {isEditing && <button type="button" onClick={() => handleRemoveItem(cIndex, iIndex)} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-300 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Role Name</label>
                              {isEditing ? (
                                <input type="text" value={item.name} onChange={(e) => handleItemChange(e, cIndex, iIndex, 'name')} placeholder="e.g. React JS Developers" className="input-premium py-2 text-sm" required />
                              ) : (
                                <div className="text-sm text-slate-700 font-medium py-2">{item.name || '-'}</div>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 mb-1">Destination Link</label>
                              {isEditing ? (
                                <input type="text" value={item.link} onChange={(e) => handleItemChange(e, cIndex, iIndex, 'link')} placeholder="e.g. /hire-us/react-js" className="input-premium py-2 text-sm" required />
                              ) : (
                                <div className="text-sm text-blue-500 font-medium py-2 break-all">{item.link || '-'}</div>
                              )}
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-semibold text-slate-500 mb-2">Role Icon</label>
                              <div className="flex items-center gap-4">
                                {isEditing && (
                                  <>
                                    <input type="file" accept="image/*" onChange={(e) => handleItemIconUpload(e, cIndex, iIndex)} className="hidden" id={`icon-${cIndex}-${iIndex}`} />
                                    <label htmlFor={`icon-${cIndex}-${iIndex}`} className="btn-kretoss px-3 py-1.5 rounded-lg cursor-pointer flex items-center text-xs whitespace-nowrap">
                                      <Upload className="w-3 h-3 mr-1.5" /> Upload Icon
                                    </label>
                                  </>
                                )}
                                {item.icon && (
                                  <div className="w-8 h-8 rounded bg-slate-50 border border-slate-100 flex items-center justify-center p-1">
                                    <img src={typeof item.icon === 'string' ? `http://localhost:5000${item.icon}` : item.icon.preview} alt="Icon" className="max-w-full max-h-full object-contain" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {category.items.length === 0 && <p className="text-xs text-slate-400 italic text-center py-2">No items added to this category yet.</p>}
                    </div>
                  </div>
                ))}
                {menu.categories.length === 0 && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                    <p className="text-slate-500 font-medium mb-4">You haven't created any menu categories.</p>
                    {isEditing && <button type="button" onClick={handleAddCategory} className="btn-kretoss px-6 py-2 rounded-xl text-sm inline-flex items-center"><Plus className="w-4 h-4 mr-2" /> Create First Category</button>}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Links Section */}
            <div className="space-y-6 pb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Bottom Footer Links</h3>
                {isEditing && <button type="button" onClick={handleAddBottomLink} className="btn-kretoss px-4 py-2 rounded-xl text-sm"><Plus className="w-4 h-4 inline mr-1" /> Add Link</button>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(menu.bottomLinks || []).map((link, lIndex) => (
                  <div key={lIndex} className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm relative pr-10">
                    {isEditing && <button type="button" onClick={() => handleRemoveBottomLink(lIndex)} className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>}
                    <div className="space-y-3">
                      <div>
                        {isEditing ? (
                          <input type="text" value={link.name} onChange={(e) => handleBottomLinkChange(e, lIndex, 'name')} placeholder="Display Name (e.g. > Hire Frontend Developer)" className="input-premium py-2 text-sm bg-white" required />
                        ) : (
                          <div className="text-sm font-bold text-slate-700 py-1">{link.name || '-'}</div>
                        )}
                      </div>
                      <div>
                        {isEditing ? (
                          <input type="text" value={link.link} onChange={(e) => handleBottomLinkChange(e, lIndex, 'link')} placeholder="URL (e.g. /hire-frontend)" className="input-premium py-2 text-sm bg-white" required />
                        ) : (
                          <div className="text-sm text-blue-500 font-medium py-1 break-all">{link.link || '-'}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {(!menu.bottomLinks || menu.bottomLinks.length === 0) && (
                  <p className="col-span-full text-sm text-slate-400 italic">No bottom links configured.</p>
                )}
              </div>
            </div>

          </form>
        ) : (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-x-8 gap-y-10 text-left">
              {menu.categories?.map(cat => {
                if (!cat.items || cat.items.length === 0) return null;
                return (
                  <div key={cat.title} className="flex flex-col">
                    <h4 className="text-[#0a1520]/80 text-[12px] font-black uppercase tracking-[0.2em] border-b border-[#0037f0]/10 pb-3 mb-5">{cat.title}</h4>
                    <ul className="space-y-0.5">
                      {cat.items.map(role => {
                        let iconStr = role.icon || '';
                        const iconUrl = typeof iconStr === 'string' ? (iconStr.startsWith('http') ? iconStr : `http://localhost:5000${iconStr}`) : iconStr.preview;
                        return (
                          <li key={role.link}>
                            <div className="flex items-center gap-3 p-1.5 -ml-1.5 rounded-lg border border-transparent transition-all duration-300 group relative overflow-hidden pr-3">
                              <div className="relative w-8 h-8 shrink-0 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100 z-10">
                                {role.icon ? (
                                  <img src={iconUrl} alt="" className="w-4 h-4 opacity-80" />
                                ) : (
                                  <div className="w-4 h-4 bg-slate-200 rounded-sm"></div>
                                )}
                              </div>
                              <span className="relative whitespace-nowrap text-[#0a1520]/80 font-semibold text-[13px] z-10 flex-1">{role.name ? role.name.replace('Hire ', '') : ''}</span>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
            {menu.bottomLinks && menu.bottomLinks.length > 0 && (
              <>
                <div className="w-full h-[2px] bg-gradient-to-r from-[#0037f0] to-[#44c7f6] mt-10 mb-6 rounded-full opacity-80"></div>
                <div className="flex flex-wrap items-center justify-start gap-x-8 gap-y-4">
                  {menu.bottomLinks.map(link => (
                    <div key={link.name} className="group flex items-center gap-1 text-[13.5px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0037f0] to-[#44c7f6]">
                      <ChevronRight className="w-4 h-4 text-[#0037f0]" />
                      <span>{link.name}</span>
                      <ArrowRight className="w-4 h-4 text-[#44c7f6] ml-1" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete {deleteTarget.type === 'category' ? 'Category' : deleteTarget.type === 'item' ? 'Item' : 'Link'}?</h3>
            <p className="text-slate-500 text-sm mb-6">Are you sure you want to delete this {deleteTarget.type === 'category' ? 'category and all its items' : 'item'}? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
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
