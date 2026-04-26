import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const EditUserScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loggedUserId, setLoggedUserId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('loggedUser');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        if (!parsedUser?._id) {
          alert('Faça login para editar usuário');
          navigate('/login');
          return;
        }

        if (parsedUser._id !== id) {
          alert('Você só pode editar sua própria conta');
          navigate('/users');
          return;
        }

        setLoggedUserId(parsedUser._id);

        const response = await api.get(`/users/${id}`);
        const user = response.data;
        setForm({
          name: user.name || '',
          email: user.email || '',
          password: '',
        });
      } catch {
        alert('Erro ao carregar usuario');
        navigate('/users');
      }
    };

    loadUser();
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        userId: loggedUserId,
        name: form.name,
        email: form.email,
      };

      if (form.password) {
        payload.password = form.password;
      }

      await api.put(`/users/${id}`, payload);
      navigate('/users');
    } catch (error) {
      alert(error?.response?.data?.message || 'Erro ao editar usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto h-full max-w-3xl px-4 py-8">
      <div className="rounded border border-white bg-[#EE4D2D] p-6 text-white">
        <h1 className="mb-6 text-2xl font-bold">Editar usuario</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Nova senha (opcional)"
            className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]"
          />
          <div className="flex gap-2">
            <button type="submit" disabled={isSubmitting} className="w-full rounded border border-white bg-white px-4 py-2 font-semibold text-[#EE4D2D]">
              {isSubmitting ? 'Salvando...' : 'Salvar alteracoes'}
            </button>
            <button type="button" onClick={() => navigate('/users')} className="w-full rounded border border-white px-4 py-2 font-semibold text-white">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserScreen;
