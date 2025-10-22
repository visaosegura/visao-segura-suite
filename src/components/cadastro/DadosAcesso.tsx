import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { KeyRound } from "lucide-react";

interface DadosAcessoProps {
  form: UseFormReturn<any>;
}

export function DadosAcesso({ form }: DadosAcessoProps) {
  const getErrorMessage = (error: any) => {
    return error?.message ? String(error.message) : "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <KeyRound className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Acesso ao Sistema</h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nomeUsuario">Nome de Usuário *</Label>
        <Input
          id="nomeUsuario"
          {...form.register("acesso.nomeUsuario")}
          placeholder="usuario123"
        />
        {(form.formState.errors.acesso as any)?.nomeUsuario && (
          <p className="text-sm text-destructive">
            {getErrorMessage((form.formState.errors.acesso as any)?.nomeUsuario)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="senha">Senha *</Label>
        <Input
          id="senha"
          type="password"
          {...form.register("acesso.senha")}
          placeholder="Mínimo 8 caracteres"
        />
        {(form.formState.errors.acesso as any)?.senha && (
          <p className="text-sm text-destructive">
            {getErrorMessage((form.formState.errors.acesso as any)?.senha)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
        <Input
          id="confirmarSenha"
          type="password"
          {...form.register("acesso.confirmarSenha")}
          placeholder="Digite a senha novamente"
        />
        {(form.formState.errors.acesso as any)?.confirmarSenha && (
          <p className="text-sm text-destructive">
            {getErrorMessage((form.formState.errors.acesso as any)?.confirmarSenha)}
          </p>
        )}
      </div>

      <div className="bg-muted p-4 rounded-lg mt-6">
        <p className="text-sm text-muted-foreground">
          <strong>Dica:</strong> Use uma senha forte com letras maiúsculas, minúsculas, números e caracteres especiais.
        </p>
      </div>
    </div>
  );
}
