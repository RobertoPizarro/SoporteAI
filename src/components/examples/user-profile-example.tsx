// Ejemplo de uso del hook useCurrentUser
import { useCurrentUser } from "@/hooks/use-current-user";

export function UserProfile() {
  const {
    isLoading,
    isAuthenticated,
    userData,
    role,
    email,
    name,
    analistaId,
    nivel,
    isAnalista,
    isColaborador
  } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <span>Cargando usuario...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div>No autenticado</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Perfil de Usuario</h2>
      
      <div className="space-y-2">
        <p><strong>Nombre:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Rol:</strong> <span className={`px-2 py-1 rounded text-sm ${
          isAnalista ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {role}
        </span></p>
        
        {isAnalista && (
          <>
            <p><strong>ID Analista:</strong> {analistaId}</p>
            <p><strong>Nivel:</strong> {nivel}</p>
          </>
        )}
        
        {userData && (
          <p><strong>Persona ID:</strong> {userData.persona_id}</p>
        )}
      </div>
    </div>
  );
}