import { useState } from "react";
import api from "../../../services/api";


function RegisterScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
            const response = await api.post("/users", {
                name,
                email,
                password,
      });

      console.log("Resposta da API:", response.data);

      setName("");
      setEmail("");
      setPassword("");
      alert("Usuário criado com sucesso! ;)");

    } catch (error) {
            const message = error.response?.data?.message || error.message;
            console.error("Erro:", error.response?.data || error.message);
            alert(message);
    }
  };

    return (
    <div className="mx-auto flex h-full max-w-6xl items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded border border-white bg-[#EE4D2D] p-6">
            <div className="w-full">
                <h1 className="text-2xl font-bold text-white">Registrar</h1>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-8">
                    <input
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded border text-[#EE4D2D] border-white px-3 py-2"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded border text-[#EE4D2D] border-white px-3 py-2"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded border text-[#EE4D2D] border-white px-3 py-2"
                        required
                    />
                    <button
                        type="submit"
                        className="rounded border  border-white bg-white px-4 py-2 font-semibold text-[#EE4D2D] disabled:opacity-60"
                    >
                        Registrar
                    </button>
                    <div className="text-center mt-2">
                        <a href="/login" className="text-sm text-white underline">
                            ja tem conta?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>  
    );
}

export default  RegisterScreen;