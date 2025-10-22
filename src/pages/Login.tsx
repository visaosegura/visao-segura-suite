import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, ShieldCheck, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    // Mock login - substituir com Supabase depois
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock: aceitar qualquer email/senha
      console.log("Login attempt:", data.email);
      
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao Visão Segura",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background sofisticado com gradiente nas cores do logotipo */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-orange-950/20">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff8c00' fill-opacity='0.15'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
      </div>
      
      {/* Elementos decorativos animados com cores do logotipo */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-orange-400/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo com design moderno */}
        <div className="text-center mb-10">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                <img 
                  src={logo} 
                  alt="Visão Segura" 
                  className="w-24 h-24 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card de login ultra moderno */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-10 overflow-hidden">
            {/* Efeito de brilho animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent -skew-x-12 transform -translate-x-full animate-pulse"></div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 relative z-10">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-white/95 font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                disabled={isLoading}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 h-14 rounded-xl transition-all duration-300 hover:bg-white/10"
              />
              {errors.email && (
                <p className="text-sm text-red-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-white/95 font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
                <Lock className="w-4 h-4 text-orange-400" />
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLoading}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 h-14 rounded-xl pr-14 transition-all duration-300 hover:bg-white/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 text-white font-bold text-base rounded-xl shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wide" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Entrando...
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <button className="text-sm text-white/70 hover:text-orange-400 hover:underline transition-colors font-medium">
              Esqueci minha senha
            </button>
          </div>
          </div>
        </div>

        <p className="text-center text-sm text-white/50 mt-10 font-medium">
          © 2025 Visão Segura. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;