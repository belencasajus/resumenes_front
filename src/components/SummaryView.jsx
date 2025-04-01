import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SummaryView() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8080/resumenes/${id}`, {credentials: 'include'})
          .then(response => {
            if (!response.ok) {
              console.error('Error en la respuesta del servidor');
              navigate('/login')
              return;
            }
            return response.json();
          })
          .then(data => {
            setBook(data);
          })
          .catch(error => {
            console.error('Error al obtener los resumenes:', error);
          });
    }, []);
    
      if (!book) {
        return (
          <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold">No se ha encontrado el libro</h1>
          </div>
        );
      }
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            to={`/book/${id}`}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver
          </Link>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-8">
              <img
                src={book.imagen}
                alt={book.titulo}
                className="w-24 h-24 object-cover rounded-lg shadow-md"
              />
              <div className="ml-6">
                <h1 className="text-3xl font-bold">{book.titulo}</h1>
                <p className="text-xl text-gray-600">by {book.autor}</p>
              </div>
            </div>
    
            <div className="prose prose-lg max-w-none">
              {book.texto.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      );
    }