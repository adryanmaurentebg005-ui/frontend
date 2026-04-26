import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";

function LoginScreen() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post("/login", form);
            localStorage.removeItem("user");
            localStorage.setItem("loggedUser", JSON.stringify(response.data.user));
            window.dispatchEvent(new Event("auth-changed"));
            navigate("/itens");
        } catch (error) {
            const message = error.response?.data?.message || "Erro ao fazer login.";
            console.error("Erro ao fazer login:", error.response?.data || error.message);
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <div className="mx-auto flex h-full max-w-6xl items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded border border-white bg-[#EE4D2D] p-6">
            <div className="w-full">
                <h1 className="text-2xl font-bold text-white">Login</h1>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-8">
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="rounded border text-[#EE4D2D] border-white px-3 py-2"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={form.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        className="rounded border text-[#EE4D2D] border-white px-3 py-2"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded border  border-white bg-white px-4 py-2 font-semibold text-[#EE4D2D] disabled:opacity-60"
                    >
                        {isLoading ? "Carregando..." : "Entrar"}
                    </button>
                    <div className="text-center mt-2">
                        <Link to="/register" className="text-sm text-white underline">
                            nao tem conta? registre-se
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    </div>  
    );
}

export default LoginScreen;