import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircleIcon, StarIcon, LockClosedIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { books, categories } from '../data/mockData';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  const filteredBooks = books.filter(book => {
    const matchesCategory = !selectedCategory || book.categories.includes(selectedCategory);
    return matchesCategory;
  });

  const topRatedBooks = [...books]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 3);


 //Añadir Navegación al libro

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              BookSummaries
            </Link>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 bg-yellow-400 text-gray-900 rounded-full font-medium hover:bg-yellow-500 transition">
                Premium <StarIcon className="h-5 w-5 ml-2" />
              </button>
              <UserCircleIcon 
                className="h-8 w-8 text-gray-600 cursor-pointer" 
                onClick={() => navigate('/profile')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search books or authors..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              onClick={() => navigate('/search')}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Top Rated Carousel */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Top Rated Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topRatedBooks.map(book => (
              <div 
                key={book.id} 
                className="group cursor-pointer"
                onClick={() => handleBookClick(book.id)}
              >
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden max-h-[400px]">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  {book.isPremium && (
                    <div className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded-full">
                      <LockClosedIcon className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-semibold">{book.title}</h3>
                <p className="text-gray-600">{book.author}</p>
                <div className="flex items-center mt-1">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1">{book.averageRating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Discover Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Discover</h2>
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[800px] overflow-y-auto">
          {filteredBooks.map(book => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative aspect-[3/4]">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                {book.isPremium && (
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded-full">
                    <LockClosedIcon className="h-5 w-5 text-white" />
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(book.id);
                  }}
                  className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                >
                  {favorites.has(book.id) ? (
                    <HeartSolid className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
              <div className="p-4">
                <div 
                  className="cursor-pointer"
                  onClick={() => handleBookClick(book.id)}
                >
                  <h3 className="text-lg font-semibold mb-1">{book.title}</h3>
                  <p className="text-gray-600 mb-2">{book.author}</p>
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1">{book.averageRating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}