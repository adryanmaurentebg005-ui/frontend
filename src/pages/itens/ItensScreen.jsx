import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ItensScreen = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
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
        const itemsResponse = await api.get('/items');
        setItems(Array.isArray(itemsResponse.data) ? itemsResponse.data : []);
      } catch {
        setItems([]);
      }
    };

    load();
  }, []);

  const canDeleteItem = (item) => {
    const itemOwnerId = item?.user?._id || item?.user;
    return Boolean(loggedUser?._id && itemOwnerId === loggedUser._id);
  };

  const handleDeleteItem = async (itemId) => {
    if (!loggedUser?._id) {
      alert('Faça login para apagar itens');
      return;
    }

    try {
      await api.delete(`/items/${itemId}`, { data: { userId: loggedUser._id } });
      setItems((current) => current.filter((item) => item._id !== itemId));
    } catch (error) {
      const message = error?.response?.data?.message || 'Erro ao apagar item';
      alert(message);
    }
  };

  return (
    <div className="mx-auto h-full max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between rounded border border-white bg-[#EE4D2D] p-4">
        <h1 className="text-2xl font-bold text-white">Feed de produtos</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/orders')}
            className="rounded border border-white px-4 py-2 text-sm text-white">
            Feed de pedidos 
          </button>
          <button onClick={() => navigate('/itens/novo')} className="rounded border border-white bg-white px-4 py-2 text-sm text-[#EE4D2D]">
            Adicionar item 
          </button>
          
          
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item._id} className="overflow-hidden rounded border border-white bg-[#EE4D2D]">
            <div className="aspect-video overflow-hidden bg-gray-100">
              <img
                src={item.image || 'https://placehold.co/1280x720/f3f4f6/111827?text=Sem+imagem'}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-2 p-4">
              <h2 className="text-lg font-semibold text-white">{item.name}</h2>
              <p className="text-sm text-white">R$ {item.price.toFixed(2)}</p>
              <p className="text-sm text-white">{item.description}</p>
              <p className="text-sm text-white">Estoque: {item.stock}</p>
              <p className="text-sm text-white">Autor: {item.user?.name || 'Usuário'}</p>

              {canDeleteItem(item) ? (
                <button
                  onClick={() => handleDeleteItem(item._id)}
                  className="mt-4 w-full rounded border border-white bg-white px-4 py-2 text-sm font-medium text-[#EE4D2D]"
                >
                  Apagar item
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded border border-white bg-[#EE4D2D] p-8 text-center text-white">Nenhum produto disponível</div>
      ) : null}
    </div>
  );
};

export default ItensScreen;
