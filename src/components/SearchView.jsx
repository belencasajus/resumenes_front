import { useState } from 'react';
import { Link } from 'react-router-dom';
import { books } from '../data/mockData';
import { StarIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function SearchView() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
        
        <div className="flex justify-center mb-12">
          <input
            type="text"
            placeholder="Search books or authors..."
            className="w-full max-w-2xl px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              </div>
              <div className="p-4">
                <Link to={`/book/${book.id}`} className="block">
                  <h3 className="text-lg font-semibold mb-1">{book.title}</h3>
                  <p className="text-gray-600 mb-2">{book.author}</p>
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1">{book.averageRating}</span>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}