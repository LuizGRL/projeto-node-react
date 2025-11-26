import { useAuth } from "../../hooks/useAuth";

export const LibraryMainPage = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Bem-vindo à Biblioteca!</h1>
      <p>Usuário logado: {user?.name || user?.email}</p>
      
      <button 
        onClick={signOut}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Sair
      </button>
    </div>
  );
};