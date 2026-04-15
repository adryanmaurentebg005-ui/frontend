import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const OrderScreen = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedUser') || localStorage.getItem('user');
    if (storedUser) {
      try {
        setLoggedUser(JSON.parse(storedUser));
      } catch {
        setLoggedUser(null);
      }
    }

    const load = async () => {
      try {
        const [ordersResponse, usersResponse] = await Promise.all([
          api.get('/orders'),
          api.get('/users'),
        ]);

        setOrders(Array.isArray(ordersResponse.data) ? ordersResponse.data : []);
        setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
      } catch {
        setOrders([]);
        setUsers([]);
      }
    };

    load();
  }, []);

  const usersById = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[user._id] = user;
      return acc;
    }, {});
  }, [users]);

  const canDeleteOrder = (order) => {
    const orderPurchaserId = order?.purchaser?._id || order?.purchaser;
    return Boolean(loggedUser?._id && orderPurchaserId === loggedUser._id);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!loggedUser?._id) {
      alert('Faça login para apagar pedidos');
      return;
    }

    try {
      await api.delete(`/orders/${orderId}`, { data: { userId: loggedUser._id } });
      setOrders((current) => current.filter((order) => order._id !== orderId));
    } catch (error) {
      const message = error?.response?.data?.message || 'Erro ao apagar pedido';
      alert(message);
    }
  };

  return (
    <div className="mx-auto h-full max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between rounded border border-white bg-[#EE4D2D] p-4">
        <h1 className="text-2xl font-bold text-white"> Feed de pedidos</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/itens')}
            className="rounded border border-white px-4 py-2 text-sm text-white"
          >
            Feed de produtos
          </button>
          <button
            onClick={() => navigate('/orders/novo')}
            className="rounded border border-white bg-white px-4 py-2 text-sm text-[#EE4D2D]"
          >
            Adicionar pedido
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => {
          const fallbackUser = usersById[order?.purchaser] || null;
          const buyer = order?.purchaser?._id ? order.purchaser : fallbackUser;
          return (
            <div key={order._id} className="rounded border border-white bg-[#EE4D2D] p-4 text-white">
              <h2 className="text-lg font-semibold">{order.orderName}</h2>
              <p className="mt-2 text-sm">
                Comprador: {buyer?.name || 'Usuário não encontrado'}
              </p>
              <p className="text-sm">E-mail: {buyer?.email || '-'}</p>
              <p className="mt-2 text-sm">Status: {order.status || 'Pending'}</p>
              <p className="text-sm">Total: R$ {Number(order.totalPrice || 0).toFixed(2)}</p>
              <p className="text-sm">Itens: {Array.isArray(order.items) ? order.items.length : 0}</p>

              {canDeleteOrder(order) ? (
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="mt-4 w-full rounded border border-white bg-white px-4 py-2 text-sm font-medium text-[#EE4D2D]"
                >
                  Apagar pedido
                </button>
              ) : null}
            </div>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 rounded border border-white bg-[#EE4D2D] p-8 text-center text-white">
          Nenhum pedido disponível
        </div>
      ) : null}
    </div>
  );
};

export default OrderScreen;
