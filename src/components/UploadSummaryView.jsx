import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CloudArrowUpIcon } from '@heroicons/react/24/solid';

export default function UploadSummaryView() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    summary: '',
    shortSummary: '',
    categories: [],
    audioFile: null,
    coverImage: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');


  useEffect(() => {
    fetch('http://localhost:8080/categorias')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener las categorías');
      }
      return response.json();
    })
    .then(data => {
      setAvailableCategories(data);
    })
    .catch(error => {
      console.error('Error al obtener las categorías:', error);
    });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, coverImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async () =>{
    if(!newCategory.trim()) return;

    try {
      const res = await fetch('http://localhost:8080/categorias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ nombre: newCategory })
      });

      if(res.ok){
        const nueva = await res.json();
        setAvailableCategories(prev => [...prev, nueva]);
        setFormData(prev => ({ 
          ...prev, 
          categories: [...prev.categories, String(nueva.id)] 
        }));
        setNewCategory('');
      } else {
        const error = await res.json();
        alert('Error al crear la categoría:', error);
      }
    } catch (error) {
      console.error('Error al crear la categoría:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    // Reset form or redirect
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          to="/profile"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Sube un Nuevo Resumen</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Autor
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resumen
              </label>
              <textarea
                required
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                multiple
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.categories}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  categories: Array.from(e.target.selectedOptions, option => option.value)
                })}
              >
                {availableCategories.map(category => (
                  <option key={category.id} value={category.id}> {category.nombre} </option>
                ))}
              </select>
              {/* Añadir nueva categoría */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Añadir nueva categoría</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Nombre de la nueva categoría"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Cover preview"
                        className="w-32 h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-32 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <CloudArrowUpIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audio
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setFormData({ ...formData, audioFile: e.target.files[0] })}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Subiendo...' : 'Sube tu Resumen'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}