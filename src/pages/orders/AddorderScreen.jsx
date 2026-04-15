import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const initialForm = {
  orderName: '',
  purchaser: '',
  product: '',
  quantity: '1',
};

const AddorderScreen = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let loggedUserId = '';
    const storedUser = localStorage.getItem('loggedUser') || localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        loggedUserId = parsedUser?._id || '';
      } catch {
        loggedUserId = '';
      }
    }

    if (loggedUserId) {
      setForm((current) => ({ ...current, purchaser: loggedUserId }));
    }

    const loadData = async () => {
      try {
        const [usersResponse, itemsResponse] = await Promise.all([
          api.get('/users'),
          api.get('/items'),
        ]);

        setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
        setItems(Array.isArray(itemsResponse.data) ? itemsResponse.data : []);
        setLoadError('');
      } catch (error) {
        console.error('Erro ao carregar dados do pedido:', error?.response?.data || error?.message || error);
        setUsers([]);
        setItems([]);
        setLoadError('Não foi possível carregar usuários e itens. Verifique se o backend está ativo.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedItem = useMemo(() => {
    return items.find((item) => item._id === form.product) || null;
  }, [form.product, items]);

  const quantity = Number(form.quantity) || 1;
  const totalPrice = selectedItem ? Number(selectedItem.price) * quantity : 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const updateQuantity = (delta) => {
    setForm((current) => {
      const nextQuantity = Math.max(
        1,
        Math.min(selectedItem?.stock ?? Infinity, Number(current.quantity || '1') + delta)
      );
      return { ...current, quantity: String(nextQuantity) };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loadError) {
      alert(loadError);
      return;
    }

    if (!form.orderName || !form.purchaser || !form.product) {
      alert('Preencha o nome do pedido, selecione um usuário e um item.');
      return;
    }

    if (!selectedItem) {
      alert('Selecione um item válido.');
      return;
    }

    if (quantity > Number(selectedItem.stock)) {
      alert('Quantidade maior que o estoque disponível.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/orders', {
        orderName: form.orderName,
        purchaser: form.purchaser,
        items: [
          {
            product: form.product,
            quantity,
          },
        ],
      });

      navigate('/orders');
    } catch (error) {
      console.error('Erro ao criar pedido:', error?.response?.data || error?.message || error);
      const message = error?.response?.data?.message || 'Erro ao criar pedido';
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
      <div className="mx-auto w-full max-w-2xl rounded border border-white bg-[#EE4D2D] p-6 text-white">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Novo pedido</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/orders')}
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
            <span className="mb-1 block text-sm font-medium text-white">Nome do pedido</span>
            <input
              name="orderName"
              value={form.orderName}
              onChange={handleChange}
              required
              className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]"
              placeholder="Ex: Pedido da manhã"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-white">Usuário</span>
            <select
              name="purchaser"
              value={form.purchaser}
              onChange={handleChange}
              required
              className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]"
            >
              <option value="">Selecione um usuário</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} - {user.email}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-white">Item</span>
            <select
              name="product"
              value={form.product}
              onChange={handleChange}
              required
              className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]"
            >
              <option value="">Selecione um item</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} - R$ {Number(item.price).toFixed(2)}
                </option>
              ))}
            </select>
          </label>

          <div className="block">
            <span className="mb-1 block text-sm font-medium text-white">Quantidade</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateQuantity(-1)}
                className="flex h-11 w-11 items-center justify-center rounded border border-white bg-white text-lg font-bold text-[#EE4D2D] disabled:opacity-50"
                disabled={quantity <= 1}
              >
                -
              </button>

              <input
                name="quantity"
                type="number"
                min="1"
                max={selectedItem?.stock || 1}
                value={form.quantity}
                onChange={handleChange}
                className="w-16 h-11 rounded border  border-white px-3 py-2 text-[#EE4D2D]"
              />

              <button
                type="button"
                onClick={() => updateQuantity(1)}
                className="flex h-11 w-11 items-center justify-center rounded border border-white bg-white text-lg font-bold text-[#EE4D2D] disabled:opacity-50"
                disabled={!selectedItem || quantity >= Number(selectedItem.stock)}
              >
                +
              </button>
            </div>
            {selectedItem ? (
              <p className="mt-2 text-xs text-white/85">Estoque disponível: {selectedItem.stock}</p>
            ) : null}
          </div>

          <div className="rounded border border-white bg-white/10 p-4">
            <p className="text-sm text-white/85">Quantidade: {quantity}</p>
            <p className="mt-2 font-medium">Total estimado: R$ {totalPrice.toFixed(2)}</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded border border-white bg-white px-4 py-2 font-semibold text-[#EE4D2D] disabled:opacity-60"
          >
            {isSubmitting ? 'Criando pedido...' : 'Criar pedido'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddorderScreen;
