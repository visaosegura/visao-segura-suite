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
import loginLogo from "@/assets/login-logo.png";

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Elementos decorativos sutis */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo clean sem frame */}
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <img 
              src={loginLogo} 
              alt="Visão Segura" 
              className="w-48 h-48 object-contain"
            />
          </div>
        </div>

        {/* Card de login clean */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                disabled={isLoading}
                className="h-12 bg-slate-50 border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-orange-500" />
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLoading}
                  className="h-12 bg-slate-50 border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
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
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all" 
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

          <div className="mt-6 text-center">
            <button className="text-sm text-slate-600 hover:text-orange-500 hover:underline transition-colors">
              Esqueci minha senha
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          © 2025 Visão Segura. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;