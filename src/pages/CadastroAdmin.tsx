import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cadastroCompleto, CadastroCompleto } from "@/lib/validations/cadastroSchema";
import { DadosEmpresa } from "@/components/cadastro/DadosEmpresa";
import { DadosContato } from "@/components/cadastro/DadosContato";
import { DadosEndereco } from "@/components/cadastro/DadosEndereco";
import { DadosAcesso } from "@/components/cadastro/DadosAcesso";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import loginLogo from "@/assets/login-logo.png";

const ETAPAS = [
  { numero: 1, titulo: "Empresa" },
  { numero: 2, titulo: "Contato" },
  { numero: 3, titulo: "Endereço" },
  { numero: 4, titulo: "Acesso" },
];

export default function CadastroAdmin() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CadastroCompleto>({
    resolver: zodResolver(cadastroCompleto),
    mode: "onChange",
    defaultValues: {
      empresa: {
        razaoSocial: "",
        cnpj: "",
        areaAtuacao: "",
      },
      contato: {
        email: "",
        celular: "",
        telefoneFixo: "",
        redesSociais: [],
      },
      endereco: {
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
      },
      acesso: {
        nomeUsuario: "",
        senha: "",
        confirmarSenha: "",
      },
    },
  });

  // Validação simples de token (substituir por validação real no backend)
  const tokenValido = token && token.length > 10;

  const proximaEtapa = async () => {
    let camposValidos = false;

    switch (etapaAtual) {
      case 1:
        camposValidos = await form.trigger(["empresa.razaoSocial", "empresa.cnpj", "empresa.areaAtuacao"]);
        break;
      case 2:
        camposValidos = await form.trigger(["contato.email", "contato.celular"]);
        break;
      case 3:
        camposValidos = await form.trigger([
          "endereco.cep",
          "endereco.rua",
          "endereco.numero",
          "endereco.bairro",
          "endereco.cidade",
          "endereco.estado",
        ]);
        break;
      case 4:
        camposValidos = await form.trigger(["acesso.nomeUsuario", "acesso.senha", "acesso.confirmarSenha"]);
        break;
    }

    if (camposValidos) {
      setEtapaAtual((prev) => Math.min(prev + 1, 4));
    }
  };

  const etapaAnterior = () => {
    setEtapaAtual((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: CadastroCompleto) => {
    setIsSubmitting(true);
    
    // Simular requisição (substituir por integração real)
    setTimeout(() => {
      console.log("Dados do cadastro:", data);
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Redirecionando para login...",
      });
      
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }, 2000);
  };

  if (!tokenValido) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-orange-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Link inválido ou expirado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              O link de cadastro que você está tentando acessar não é válido ou já expirou.
            </p>
            <Button onClick={() => navigate("/")}>Voltar para Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={loginLogo} alt="Visão Segura" className="w-32 h-32 mx-auto mb-4 object-contain" />
          <h1 className="text-3xl font-bold text-foreground">Cadastro de Administrador</h1>
          <p className="text-muted-foreground mt-2">Complete seu cadastro para acessar o sistema</p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {ETAPAS.map((etapa, index) => (
              <div key={etapa.numero} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      etapaAtual >= etapa.numero
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {etapa.numero}
                  </div>
                  <span className="text-xs mt-2 text-center font-medium">{etapa.titulo}</span>
                </div>
                {index < ETAPAS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-colors ${
                      etapaAtual > etapa.numero ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Formulário */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {etapaAtual === 1 && <DadosEmpresa form={form} />}
              {etapaAtual === 2 && <DadosContato form={form} />}
              {etapaAtual === 3 && <DadosEndereco form={form} />}
              {etapaAtual === 4 && <DadosAcesso form={form} />}

              {/* Botões de navegação */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={etapaAnterior}
                  disabled={etapaAtual === 1 || isSubmitting}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>

                {etapaAtual < 4 ? (
                  <Button type="button" onClick={proximaEtapa} disabled={isSubmitting}>
                    Próximo
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      "Finalizar Cadastro"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-muted-foreground">
          © 2025 Visão Segura - Todos os direitos reservados
        </footer>
      </div>
    </div>
  );
}
