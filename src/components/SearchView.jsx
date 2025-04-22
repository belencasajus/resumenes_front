import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function SearchView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/resumenes', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar los libros');
        return res.json();
      })
      .then(data => setBooks(data))
      .catch(err => console.error(err));
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.autor.toLowerCase().includes(searchTerm.toLowerCase());
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
            ← Volver
          </Link>
        </div>
        
        <div className="flex justify-center mb-12">
          <input
            type="text"
            placeholder="Búsqueda de libros o autores..."
            className="w-full max-w-2xl px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden" onClick={()=> navigate(`/book/${book.id}`)}>
              <div className="relative aspect-[3/4]">
                <img
                  src={book.imagen}
                  alt={book.titulo}
                  className="w-full h-full object-cover"
                />
                {book.premium && (
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded-full">
                    <LockClosedIcon className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{book.titulo}</h3>
                <p className="text-gray-600 mb-2">{book.autor}</p>
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1">{book.valoracionMedia.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredBooks.length === 0 && (
          <p className="text-center text-gray-500 mt-12">No se encontraron resultados para tu búsqueda.</p>
        )}
      </div>
    </div>
  );
}