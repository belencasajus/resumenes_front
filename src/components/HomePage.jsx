import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircleIcon, StarIcon, LockClosedIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/resumenes')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then(data => {
        setBooks(data);
        setFilteredBooks(data);    //por defecto, todo
      })
      .catch(error => {
        console.error('Error al obtener los resumenes:', error);
      });

      fetch('http://localhost:8080/usuarios/favoritos', {
        credentials: 'include'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('No autenticado o error obteniendo favoritos');
          }
          return response.json();
        })
        .then(data => {
          // Suponiendo que `data` es un array de resumenes
          const favIds = data.map(book => book.id);
          setFavorites(new Set(favIds));
        })
        .catch(err => {
          console.warn('No se pudieron cargar favoritos:', err);
          setFavorites(new Set()); // vacío si no autenticado
        });
      
      fetch('http://localhost:8080/categorias')
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al obtener las categorías');
          }
          return response.json();
        })
        .then(data => {
          setCategories(data);
        })
        .catch(error => {
          console.error('Error al obtener las categorías:', error);
        });
      
        fetch('http://localhost:8080/usuarios/me', { credentials: 'include' })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('No autenticado');
        })
        .then(setUser)
        .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setFilteredBooks(books);
    } else {
      fetch(`http://localhost:8080/resumenes?categoriaId=${selectedCategory}`)
      .then(res =>{
        if (!res.ok) {
          throw new Error('Error al filtrar');
        }
        return res.text();
      })
      .then(text => {
        if(!text) return [];
        return JSON.parse(text);
      })
      .then(setFilteredBooks)
      .catch(err => {
        console.error('Error al filtrar libros:', err);
      });
    }
  }, [selectedCategory, books]);


  const topRatedBooks = [...books]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 3);

    const toggleFavorite = async (bookId) => {
      try {
        const isFav = favorites.has(bookId);
        const method = isFav ? 'DELETE' : 'POST';
    
        const response = await fetch(`http://localhost:8080/usuarios/favoritos/${bookId}`, {
          method,
          credentials: 'include'
        });
    
        if (response.ok) {
          setFavorites(prev => {
            const updated = new Set(prev);
            if (isFav) {
              updated.delete(bookId);
            } else {
              updated.add(bookId);
            }
            return updated;
          });
        } else if (response.status === 401 || response.status === 403) {
          navigate('/login');
        } else {
          const msg = await response.text();
          alert(`Error actualizando favoritos: ${msg}`);
        }
      } catch (error) {
        console.error('Error actualizando favoritos:', error);
        alert('No se pudo actualizar favoritos');
      }
    };
    

  const handleBookClick = async (bookId) => {
    try {
      const response = await fetch('http://localhost:8080/usuarios/me', {
        credentials: 'include'
      });
  
      if (response.ok) {
        navigate(`/book/${bookId}`);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error al verificar la autenticación:', error);
      navigate('/login');
    }
  };

  const handleProfileClick = async () => {
    try {
      const response = await fetch('http://localhost:8080/usuarios/me', {
        credentials: 'include'
      });
  
      if (response.ok) {
        navigate('/profile');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error al verificar la autenticación:', error);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Resumen.es
            </Link>
            <div className="flex items-center space-x-4">
            {user && user.rol == "VISITANTE" && (
                <button
                  className="flex items-center px-4 py-2 bg-yellow-400 text-gray-900 rounded-full font-medium hover:bg-yellow-500 transition"
                  onClick={() => navigate('/subscription')}
                >
                  Premium <StarIcon className="h-5 w-5 ml-2" />
                </button>
              )}
              {user && user.rol == "LECTOR" && (
                <button
                  className="flex items-center px-4 py-2 bg-gray-300 text-gray-600 rounded-full font-medium cursor-default select-none"
                >
                  Suscripción Premium <StarIcon className="h-5 w-5 ml-2" />
                </button>
              )}
              <UserCircleIcon 
                className="h-8 w-8 text-gray-600 cursor-pointer" 
                onClick={() => handleProfileClick()}
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
              placeholder="Busca Resúmenes o Autores..."
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
          <h2 className="text-2xl font-bold mb-6">Libros destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topRatedBooks.map(book => (
              <div 
                key={book.id} 
                className="group cursor-pointer"
                onClick={() => handleBookClick(book.id)}
              >
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden max-h-[400px]">
                  <img
                    src={`http://localhost:8080${book.imagen}`}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  {book.premium && (
                    <div className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded-full">
                      <LockClosedIcon className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-semibold">{book.titulo}</h3>
                <p className="text-gray-600">{book.autor}</p>
                <div className="flex items-center mt-1">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1">{book.valoracionMedia}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Discover Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Catálogo</h2>
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Categorías</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.nombre}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[800px] overflow-y-auto">
          {filteredBooks.map(book => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden" onClick={() => handleBookClick(book.id)}>
              <div className="relative aspect-[3/4]">
                <img
                  src={`http://localhost:8080${book.imagen}`}
                  alt={book.titulo}
                  className="w-full h-full object-cover"
                />
                {book.premium && (
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
                  <h3 className="text-lg font-semibold mb-1">{book.titulo}</h3>
                  <p className="text-gray-600 mb-2">{book.autor}</p>
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1">{book.valoracionMedia}</span>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}