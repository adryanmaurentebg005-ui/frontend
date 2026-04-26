import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const initialForm = {
  name: '',
  price: '',
  stock: '',
  description: '',
};

const AddItemScreen = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [form, setForm] = useState(initialForm);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedUser');
    if (!storedUser) {
      setLoadError('Não foi possível identificar o usuário logado. Faça login novamente.');
      setIsLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser?._id) {
        setLoadError('Não foi possível identificar o usuário logado. Faça login novamente.');
        setIsLoading(false);
        return;
      }

      setUserId(parsedUser._id);
      setLoadError('');
    } catch {
      setLoadError('Não foi possível identificar o usuário logado. Faça login novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageUrlChange = (event) => {
    setImageUrl(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loadError) {
      alert(loadError);
      return;
    }

    if (!userId || !imageUrl) {
      alert('Faça login e informe a URL da imagem para continuar.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/items', {
        user: userId,
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description,
        image: imageUrl,
      });

      navigate('/itens');
    } catch (error) {
      console.error('Erro ao criar item:', error?.response?.data || error?.message || error);
      const message = error?.response?.data?.message || 'Erro ao criar item';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex h-full max-w-6xl items-center justify-center px-4">
        <p className="text-gray-700">Carregando formulário...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto h-full max-w-6xl px-4 py-8">
      <div className="mx-auto w-full max-w-lg rounded border border-white bg-[#EE4D2D] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Novo item</h1>
          <button
            type="button"
            onClick={() => navigate('/itens')}
            className="rounded border border-white px-4 py-2 text-sm font-medium text-white">
            Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            {loadError ? (
              <div className="rounded border border-white bg-white/15 px-3 py-2 text-sm text-white">
                {loadError}
              </div>
            ) : null}

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white">Nome</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded border text-[#EE4D2D] border-white px-3 py-2"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-white">Preço</span>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full rounded border text-[#EE4D2D] border-white px-3 py-2"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-white">Estoque</span>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  className="w-full rounded border text-[#EE4D2D] border-white px-3 py-2"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white">Descrição</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded border text-[#EE4D2D] border-white px-3 py-2"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white">URL da imagem</span>
              <input
                name="imageUrl"
                value={imageUrl}
                onChange={handleImageUrlChange}
                required
                className="w-full rounded border text-[#EE4D2D] border-white px-3 py-2"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded border border-white bg-white px-4 py-2 font-semibold text-[#EE4D2D] disabled:opacity-60"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar item'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemScreen;
