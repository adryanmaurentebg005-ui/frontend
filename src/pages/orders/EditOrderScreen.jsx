import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const EditOrderScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    orderName: '',
    purchaser: '',
    product: '',
    quantity: '1',
    status: 'Pending',
    couponCode: '',
  });
  const [userId, setUserId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = localStorage.getItem('loggedUser');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        if (!parsedUser?._id) {
          alert('Faça login para editar pedidos');
          navigate('/login');
          return;
        }

        const [orderRes, usersRes, itemsRes] = await Promise.all([
          api.get(`/orders/${id}`),
          api.get('/users'),
          api.get('/items'),
        ]);

        const order = orderRes.data;
        const firstItem = order.items?.[0];
        const ownerId = order.author?._id || order.author || order.purchaser?._id || order.purchaser;

        if (ownerId !== parsedUser._id) {
          alert('Apenas o autor do pedido pode editar');
          navigate('/orders');
          return;
        }

        setUserId(parsedUser._id);

        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        setItems(Array.isArray(itemsRes.data) ? itemsRes.data : []);

        setForm({
          orderName: order.orderName || '',
          purchaser: order.purchaser?._id || order.purchaser || '',
          product: firstItem?.product?._id || firstItem?.product || '',
          quantity: String(firstItem?.quantity || 1),
          status: order.status || 'Pending',
          couponCode: order.coupon?.code || '',
        });
      } catch {
        alert('Erro ao carregar pedido');
        navigate('/orders');
      }
    };

    loadData();
  }, [id, navigate]);

  const selectedItem = useMemo(() => items.find((item) => item._id === form.product), [items, form.product]);
  const subtotal = selectedItem ? Number(selectedItem.price || 0) * Number(form.quantity || 0) : 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await api.put(`/orders/${id}`, {
        userId,
        orderName: form.orderName,
        status: form.status,
        couponCode: form.couponCode,
        items: [
          {
            product: form.product,
            quantity: Number(form.quantity),
          },
        ],
      });
      navigate('/orders');
    } catch (error) {
      alert(error?.response?.data?.message || 'Erro ao editar pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto h-full max-w-3xl px-4 py-8">
      <div className="rounded border border-white bg-[#EE4D2D] p-6 text-white">
        <h1 className="mb-6 text-2xl font-bold">Editar pedido</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="orderName" value={form.orderName} onChange={handleChange} required className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]" />

          <select name="purchaser" value={form.purchaser} onChange={handleChange} disabled className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]">
            <option value="">Selecione o comprador</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>{user.name} - {user.email}</option>
            ))}
          </select>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <select name="product" value={form.product} onChange={handleChange} required className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]">
              <option value="">Selecione item</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>{item.name} - R$ {Number(item.price).toFixed(2)}</option>
              ))}
            </select>
            <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} required className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <select name="status" value={form.status} onChange={handleChange} className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]">
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
            </select>
            <input name="couponCode" value={form.couponCode} onChange={handleChange} placeholder="Cupom opcional" className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]" />
          </div>

          <div className="rounded border border-white bg-white/10 p-4">
            <p className="text-sm">Subtotal estimado: R$ {subtotal.toFixed(2)}</p>
            <p className="text-xs text-white/90">O valor final sera recalculado na API com base no cupom.</p>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={isSubmitting} className="w-full rounded border border-white bg-white px-4 py-2 font-semibold text-[#EE4D2D]">
              {isSubmitting ? 'Salvando...' : 'Salvar pedido'}
            </button>
            <button type="button" onClick={() => navigate('/orders')} className="w-full rounded border border-white px-4 py-2 font-semibold text-white">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderScreen;
