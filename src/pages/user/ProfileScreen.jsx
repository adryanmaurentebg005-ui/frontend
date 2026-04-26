import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const storedUser = localStorage.getItem("loggedUser");
      if (!storedUser) {
        navigate("/login");
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser?._id) {
          navigate("/login");
          return;
        }

        setUserId(parsedUser._id);
        const response = await api.get(`/users/${parsedUser._id}`);
        setForm({
          name: response.data?.name || "",
          email: response.data?.email || "",
          password: "",
        });
      } catch {
        alert("Nao foi possivel carregar o perfil");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userId) return;

    setIsSaving(true);

    try {
      await api.put(`/users/${userId}`, {
        ...form,
        userId,
      });

      const storedUser = localStorage.getItem("loggedUser");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const updatedUser = { ...parsedUser, name: form.name, email: form.email };
        localStorage.setItem("loggedUser", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("auth-changed"));
      }
      alert("Perfil atualizado com sucesso");
    } catch {
      alert("Nao foi possivel atualizar o perfil");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex h-full max-w-6xl items-center justify-center px-4">
        <p className="text-gray-700">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto h-full max-w-6xl px-4 py-8">
      <div className="mx-auto w-full max-w-md rounded border border-white bg-[#EE4D2D] p-6">
        <h1 className="mb-6 text-2xl font-bold text-white">Meu Perfil</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-white">
            Nome
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="mt-1 w-full rounded border border-white text-[#EE4D2D] px-3 py-2"
              required
            />
          </label>

          <label className="block text-sm font-medium text-white">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="mt-1 w-full rounded border border-white text-[#EE4D2D] px-3 py-2"
              required
            />
          </label>

          <label className="block text-sm font-medium text-white">
            Nova senha
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              className="mt-1 w-full placeholder:text-[#EE4D2D] rounded border border-white text-[#EE4D2D] px-3 py-2"
              placeholder="Opcional"
            />
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded border border-white bg-white px-4 py-2 font-semibold text-[#EE4D2D] disabled:opacity-60"
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </button>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("loggedUser");
              localStorage.removeItem("user");
              window.dispatchEvent(new Event("auth-changed"));
              navigate("/login");
            }}
            className="w-full rounded border border-white px-4 py-2 font-semibold text-white"
          >
            Sair da conta
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileScreen;
