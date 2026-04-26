import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CouponScreen = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);

  const loadCoupons = async () => {
    try {
      const response = await api.get('/coupons');
      setCoupons(Array.isArray(response.data) ? response.data : []);
    } catch {
      setCoupons([]);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja apagar este cupom?')) {
      return;
    }

    try {
      await api.delete(`/coupons/${id}`);
      setCoupons((current) => current.filter((coupon) => coupon._id !== id));
    } catch (error) {
      alert(error?.response?.data?.message || 'Erro ao deletar cupom');
    }
  };

  return (
    <div className="mx-auto h-full max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between rounded border border-white bg-[#EE4D2D] p-4 text-white">
        <h1 className="text-2xl font-bold">Cupons</h1>
        <button
          onClick={() => navigate('/coupons/novo')}
          className="rounded border border-white bg-white px-4 py-2 text-sm font-semibold text-[#EE4D2D]"
        >
          Novo cupom
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="rounded border border-white bg-[#EE4D2D] p-8 text-center text-white">
          Nenhum cupom cadastrado
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="rounded border border-white bg-[#EE4D2D] p-4 text-white">
              <h2 className="text-lg font-semibold">{coupon.code}</h2>
              <p className="text-sm">Tipo: {coupon.discountType}</p>
              <p className="text-sm">Valor: {Number(coupon.discountValue || 0).toFixed(2)}</p>
              <p className="text-sm">Minimo do pedido: R$ {Number(coupon.minOrderValue || 0).toFixed(2)}</p>
              <p className="text-sm">Expira em: {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : '-'}</p>
              <p className="text-sm">Ativo: {coupon.isActive ? 'Sim' : 'Nao'}</p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/coupons/editar/${coupon._id}`)}
                  className="w-full rounded border border-white bg-white px-3 py-2 text-sm font-semibold text-[#EE4D2D]"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="w-full rounded border border-white px-3 py-2 text-sm font-semibold text-white"
                >
                  Apagar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CouponScreen;
