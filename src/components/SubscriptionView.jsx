import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function SubscriptionView() {
  const features = [
    "Acceso ilimitados a todos los resúmenes",
    "Versiones en audio de los resúmenes",
    "Contenido premium explusivo",
    "Recomendaciones de lectura personalizadas",
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8080/suscripciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          
        })
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          alert('Credenciales inválidas');
        } else {
          alert('Error al iniciar sesión');
        }
        return;
      }
  
      // Redirigir al home u otra página tras login exitoso
      navigate('/');
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error al conectarse con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Accede a Premium
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Desbloque todo el potencial de tu experiencia de lectura con nuestras características premium
          </p>
        </div>

        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Premium Illustration */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-center">
            <div className="inline-block bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <span className="block text-white text-sm font-semibold mb-1">Mensualidad</span>
              <span className="text-5xl font-bold text-white">5.99€</span>
              <span className="block text-white/80 mt-1">por mes</span>
            </div>
          </div>

          {/* Features List */}
          <div className="p-8">
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Upgrade Button */}
            <button className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl" onClick={()=>handleSubmit()}>
              Accede a Premium
            </button>

            {/* Money-back Guarantee */}
            <p className="text-center text-sm text-gray-500 mt-4">
               Cancela cuando quieras
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}