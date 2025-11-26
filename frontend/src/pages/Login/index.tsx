
import { useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AppInput from "../../components/Input/AppInput/AppInput";
import AppButton from "../../components/Button/AppButton";
import logo from "../../assets/logo.png";
import { toast } from "react-toastify";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(email.toLowerCase(), password);
      navigate("/library");
      toast.success("Login realizado com sucesso!");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Erro ao logar");
    }
  };

  return (
    <div className="bg-background h-full flex align-middle justify-center items-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-[40px]  bg-white p-10 rounded-3xl h-fit w-fit items-center">
        <img src={logo} alt="logo" className="w-[200px] h-[50px]"/>
        <AppInput 
          label="Email"
          placeholder="email"
          value={email}         
          onChange={setEmail} 
          titleCase={false}
          disabled={loading}
          required
          />        
        <AppInput
          label="Senha"
          placeholder="Senha"
          value={password}         
          onChange={setPassword} 
          titleCase={false}
          disabled={loading}
          required/>   
        
        <AppButton type="submit" loading={loading} variant="primary">
          Entrar
        </AppButton>
      </form>
    </div>
  );
};