import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const initialForm = {
  code: '',
  discountType: 'percent',
  discountValue: '',
  minOrderValue: '',
  expiresAt: '',
  isActive: true,
};

const AddCouponScreen = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/coupons', {
        code: form.code,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderValue: Number(form.minOrderValue || 0),
        expiresAt: form.expiresAt,
        isActive: form.isActive,
      });
      navigate('/coupons');
    } catch (error) {
      alert(error?.response?.data?.message || 'Erro ao cadastrar cupom');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto h-full max-w-3xl px-4 py-8">
      <div className="rounded border border-white bg-[#EE4D2D] p-6 text-white">
        <h1 className="mb-6 text-2xl font-bold">Novo cupom</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="code"
            placeholder="Codigo"
            value={form.code}
            onChange={handleChange}
            required
            className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]"
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]"
            >
              <option value="percent">Percentual</option>
              <option value="fixed">Valor fixo</option>
            </select>

            <input
              name="discountValue"
              type="number"
              min="0"
              step="0.01"
              placeholder="Valor do desconto"
              value={form.discountValue}
              onChange={handleChange}
              required
              className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              name="minOrderValue"
              type="number"
              min="0"
              step="0.01"
              placeholder="Pedido minimo"
              value={form.minOrderValue}
              onChange={handleChange}
              className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]"
            />

            <input
              name="expiresAt"
              type="date"
              value={form.expiresAt}
              onChange={handleChange}
              required
              className="w-full rounded border border-white px-3 py-2 text-[#EE4D2D]"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            Cupom ativo
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded border border-white bg-white px-4 py-2 font-semibold text-[#EE4D2D]"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar cupom'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/coupons')}
              className="w-full rounded border border-white px-4 py-2 font-semibold text-white"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCouponScreen;
