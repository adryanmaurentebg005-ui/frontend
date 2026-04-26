import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const UserListScreen = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      try {
        setLoggedUser(JSON.parse(storedUser));
      } catch {
        setLoggedUser(null);
      }
    }

    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!loggedUser?._id) {
      alert('Faça login para apagar usuário');
      return;
    }

    if (loggedUser._id !== id) {
      alert('Você só pode apagar sua própria conta');
      return;
    }

    if (!window.confirm('Deseja apagar este usuario?')) {
      return;
    }

    try {
      await api.delete(`/users/${id}`, { data: { userId: loggedUser._id } });
      setUsers((current) => current.filter((user) => user._id !== id));
      localStorage.removeItem('loggedUser');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-changed'));
      navigate('/login');
    } catch (error) {
      alert(error?.response?.data?.message || 'Erro ao deletar usuario');
    }
  };

  return (
    <div className="mx-auto h-full max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between rounded border border-white bg-[#EE4D2D] p-4 text-white">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <button
          onClick={() => navigate('/users/novo')}
          className="rounded border border-white bg-white px-4 py-2 text-sm font-semibold text-[#EE4D2D]"
        >
          Novo usuario
        </button>
      </div>

      {users.length === 0 ? (
        <div className="rounded border border-white bg-[#EE4D2D] p-8 text-center text-white">
          Nenhum usuario cadastrado
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {users.map((user) => (
            <div key={user._id} className="rounded border border-white bg-[#EE4D2D] p-4 text-white">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm">Email: {user.email}</p>

              <div className="mt-4 flex gap-2">
                {loggedUser?._id === user._id ? (
                  <button
                    onClick={() => navigate(`/users/editar/${user._id}`)}
                    className="w-full rounded border border-white bg-white px-3 py-2 text-sm font-semibold text-[#EE4D2D]"
                  >
                    Editar
                  </button>
                ) : null}
                {loggedUser?._id === user._id ? (
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="w-full rounded border border-white px-3 py-2 text-sm font-semibold text-white"
                  >
                    Apagar
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserListScreen;
