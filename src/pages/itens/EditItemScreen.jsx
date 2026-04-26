import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const EditItemScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', price: '', stock: '', description: '', image: '' });
  const [userId, setUserId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const storedUser = localStorage.getItem('loggedUser');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        if (!parsedUser?._id) {
          alert('Faça login para editar itens');
          navigate('/login');
          return;
        }

        const response = await api.get(`/items/${id}`);
        const item = response.data;
        const ownerId = item?.user?._id || item?.user;

        if (ownerId !== parsedUser._id) {
          alert('Apenas o autor do item pode editar');
          navigate('/itens');
          return;
        }

        setUserId(parsedUser._id);
        setForm({
          name: item.name || '',
          price: String(item.price ?? ''),
          stock: String(item.stock ?? ''),
          description: item.description || '',
          image: item.image || '',
        });
      } catch {
        alert('Erro ao carregar item');
        navigate('/itens');
      }
    };

    loadItem();
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await api.put(`/items/${id}`, {
        userId,
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
        image: form.image,
      });
      navigate('/itens');
    } catch (error) {
      alert(error?.response?.data?.message || 'Erro ao editar item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto h-full max-w-3xl px-4 py-8">
      <div className="rounded border border-white bg-[#EE4D2D] p-6 text-white">
        <h1 className="mb-6 text-2xl font-bold">Editar item</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]" />
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]" />
          </div>
          <textarea name="description" rows={4} value={form.description} onChange={handleChange} className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]" />
          <input name="image" value={form.image} onChange={handleChange} required className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]" />

          <div className="flex gap-2">
            <button type="submit" disabled={isSubmitting} className="w-full rounded border border-white bg-white px-4 py-2 font-semibold text-[#EE4D2D]">
              {isSubmitting ? 'Salvando...' : 'Salvar item'}
            </button>
            <button type="button" onClick={() => navigate('/itens')} className="w-full rounded border border-white px-4 py-2 font-semibold text-white">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemScreen;
