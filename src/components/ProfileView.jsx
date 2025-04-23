import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCircleIcon, TrophyIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useMemo } from 'react';


export default function ProfileView() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [leidos, setLeidos] = useState([]);
  const[profileImage, setProfileImage] = useState(null);
  const trophies = useMemo(() => {
    if(!profile) return [];

    return [
      {
        id: 1,
        name: "Primeros Pasos",
        description: "Leer 2 libros",
        icon: "📚",
        progress: leidos.length,
        total: 2,
      },
      {
        id: 2,
        name: "Crítico Literario",
        description: "Valorar al menos 1 libro",
        icon: "✍️",
        progress: profile.valoraciones?.length || 0,
        total: 1,
      },
      {
        id: 3,
        name: "Miembro Premium",
        description: "Formar parte de la comunidad",
        icon: "🌟",
        progress: profile.rol === "LECTOR" ? 1 : 0,
        total: 1,
      },
      {
        id: 4,
        name: "Contribuidor",
        description: "Subir un resumen",
        icon: "📤",
        progress: profile.resumenesSubidos?.length || 0,
        total: 1,
      }
    ];
  }, [profile, leidos]);



  useEffect(() => {
    fetch('http://localhost:8080/usuarios/me', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('No autenticado');
        return res.json();
      })
      .then(data => {
        console.log('Usuario:', data);                
        console.log('Valoraciones:', data.valoraciones); 
        setProfile(data);
      })
      .catch(() => navigate('/login'));

    fetch('http://localhost:8080/usuarios/favoritos', { credentials: 'include' })
      .then(res => res.json())
      .then(setFavorites)
      .catch(console.error);

    fetch('http://localhost:8080/usuarios/leidos', { credentials: 'include' })
      .then(res => res.json())
      .then(setLeidos)
      .catch(console.error);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include'  // importante para que se mande la cookie de sesión
      });
      navigate('/');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      navigate('/');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      reader.onloadend = () => {
        const base64Image = reader.result;
        setProfileImage(base64Image);
      
        // Aquí haces el envío al backend
        fetch('http://localhost:8080/usuarios/imagen', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ imagen: base64Image })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('No se pudo actualizar la imagen');
            }
          })
          .catch(error => {
            console.error('Error al guardar la imagen:', error);
            alert('Hubo un error al guardar la imagen de perfil.');
          });
      };
    }
  };

  const handleCancelarSuscripcion = async () => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres cancelar tu suscripción?");
    if (!confirmacion) return;

    try {
      const res = await fetch("http://localhost:8080/usuarios/suscripcion", {
        method: "DELETE",
        credentials: "include"
      });
  
      if (res.ok) {
        alert("Suscripción cancelada correctamente");
        window.location.reload();
      } else {
        const errorMsg = await res.text();
        alert("Error: " + errorMsg);
      }
    } catch (err) {
      console.error("Error cancelando suscripción:", err);
      alert("Hubo un error al cancelar la suscripción.");
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Volver
          </Link>
          <Link
            to="/upload"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Subir un Resumen
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex gap-8">
            {/* Left Section (2/5) */}
            <div className="w-2/5 space-y-6">
              {/* Profile Image */}
              <div className="relative w-48 h-48 mx-auto">
                <label htmlFor="profile-image" className="cursor-pointer block">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-full h-full text-gray-300" />
                  )}
                  <input
                    type="file"
                    id="profile-image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* User Info */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-center">Información del Usuario</h2>
                <div className="space-y-2">
                  <p className="text-gray-600">Username: {profile.username}</p>
                  <p className="text-gray-600">Email: {profile.email}</p>
                  <p className="text-gray-600">Rol: {profile.rol}</p>
                </div>
              </div>

              {/* Premium / Cancelar Suscripción Button */}
              {profile.rol === 'VISITANTE' ? (
                <button
                className="w-full bg-yellow-400 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-500 transition font-medium"
                onClick={() => navigate('/subscription')}
                >
                Consigue Premium
                </button>
              ) : (
                <button
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  onClick={handleCancelarSuscripcion}
                >
                  Cancelar Suscripción
                </button>
              )}

              {/* Trophies Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <TrophyIcon className="h-6 w-6 text-yellow-400 mr-2" />
                  Logros
                </h2>
                <div className="space-y-4">
                  {trophies.map(trophy => (
                    <div key={trophy.id} className="bg-white p-3 rounded-md shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{trophy.icon}</span>
                          <div>
                            <h3 className="font-medium">{trophy.name}</h3>
                            <p className="text-sm text-gray-600">{trophy.description}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">
                          {Math.min(trophy.progress, trophy.total)}/{trophy.total}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((trophy.progress / trophy.total) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Cerrar sesión
              </button>
            </div>

            {/* Right Section */}
            <div className="w-3/5 space-y-8">
              {/* Reading Stats */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Tus Estadísticas</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">{leidos.length}</p>
                    <p className="text-gray-600">Resúmenes Leídos</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">{profile.valoraciones?.length || 0}</p>
                    <p className="text-gray-600">Valoraciones</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">
                      {profile.valoraciones && profile.valoraciones.length > 0
                        ? (
                            profile.valoraciones.reduce((acc, v) => acc + v.rating, 0) /
                            profile.valoraciones.length
                          ).toFixed(1)
                        : '0.0'}
                    </p>
                    <p className="text-gray-600">Valoración promedio</p>
                  </div>
                </div>
              </div>
              {/* Favorite Books */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Resúmenes Favoritos</h2>
                <div className="space-y-4">
                  {favorites.map(book => (
                    <div key={book.id} className="flex gap-4 items-center">
                      <img
                        src={book.imagen}
                        alt={book.titulo}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{book.titulo}</h3>
                        <p className="text-gray-600">{book.autor}</p>
                      </div>
                    </div>
                  ))}
                  {favorites.length === 0 && <p className="text-gray-500">Todavía no tienes favoritos</p>}
                </div>
              </div>

              {/* Read Books */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Resúmenes Leídos</h2>
                <div className="space-y-4">
                  {leidos.map(book => (
                    <div key={book.id} className="flex gap-4 items-center">
                      <img
                        src={book.imagen}
                        alt={book.titulo}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{book.titulo}</h3>
                        <p className="text-gray-600">{book.autor}</p>
                      </div>
                    </div>
                  ))}
                  {leidos.length === 0 && <p className="text-gray-500">No books read yet.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
