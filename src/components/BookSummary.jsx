import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate} from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';


export default function BookSummary() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reviews, setReviews] = useState(book?.reviews || []);
  const [usuario, setUsuario] = useState(null);
  const [haLeido, setHaLeido] = useState(false);
  
  useEffect(() => {
    fetch(`http://localhost:8080/resumenes/${id}`, {credentials: 'include'})
      .then(async response => {
        if (!response.ok) { 
          if(response.status === 401) {
            navigate('/login')
            return;
          }
          if(response.status === 403) {
            navigate('/subscription')
            return;
          }
          throw new Error('Error al obtener el resumen del libro');
        }
        const data = await response.json();
        setBook(data);
        setReviews(data.valoraciones || []);

        const userRes = await fetch('http://localhost:8080/usuarios/me', {
          credentials: 'include'
        });
  
        if (userRes.ok) {
          const userData = await userRes.json();
          setUsuario(userData);
  
          const idsLeidos = userData.resumenesLeidos.map(r => r.id);
          setHaLeido(idsLeidos.includes(data.id));
        }
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

  const handleNewReview = async (review) => {
    try{
      const response = await fetch(`http://localhost:8080/valoraciones/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          rating: review.rating,
          comentario: review.comment,
        }),
      });
      if (!response.ok) {
        const error = await response.text();
        alert(`Error al enviar la valoración: ${error}`);
        return;
      }
      const nuevaValoracion = await response.json();
      setReviews([nuevaValoracion, ...reviews]);
    } catch (error) {
      console.error('Error al enviar la valoración:', error);
      alert('Error al enviar la valoración.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Link
        to="/"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Volver
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:sticky md:top-6 self-start">
          <img
            src={`http://localhost:8080${book.imagen}`}
            alt={book.titulo}
            className="w-full h-[600px] object-cover rounded-lg shadow-2xl"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold">{book.titulo}</h1>
          <p className="text-2xl text-gray-600 mt-2">por {book.autor}</p>
          
          <div className="flex items-center mt-6">
            <StarRating rating={book.valoracionMedia} readonly />
            <span className="ml-2 text-gray-600">
              ({book.valoracionMedia} Valoración Media)
            </span>
          </div>

          <div className="mt-8">
            <div className="mt-6 space-x-4">
              <Link
                to={`/summary/${book.id}/summary`}
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition"
              >
                Leer resumen completo
              </Link>

              <Link
                to={`/summary/${book.id}/audio`}
                className="inline-block bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition"
              >
                Escuchar resumen
              </Link>
            </div>
          </div>


          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Valoraciones</h2>
            {haLeido ? (

              
              <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Escribir una valoración</h3>
              <ReviewForm onSubmit={handleNewReview} />
            </div>
              ) : (
                <p className="text-gray-500 mb-8">
                Solo puedes valorar este resumen si lo has leído.
              </p>
              )
            }

            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <StarRating rating={review.rating} readonly />
                      <span className="ml-2 font-semibold">{review.username}</span>
                    </div>
                    <span className="text-gray-500">
                      {format(new Date(review.fecha), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{review.comentario}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}