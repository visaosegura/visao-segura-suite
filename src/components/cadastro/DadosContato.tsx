import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import InputMask from "react-input-mask";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Plus, X } from "lucide-react";

interface DadosContatoProps {
  form: UseFormReturn<any>;
}

export function DadosContato({ form }: DadosContatoProps) {
  const [redeSocial, setRedeSocial] = useState("");
  const redesSociais = form.watch("contato.redesSociais") || [];

  const getErrorMessage = (error: any) => {
    return error?.message ? String(error.message) : "";
  };

  const adicionarRedeSocial = () => {
    if (redeSocial.trim()) {
      form.setValue("contato.redesSociais", [...redesSociais, redeSocial]);
      setRedeSocial("");
    }
  };

  const removerRedeSocial = (index: number) => {
    const novasRedes = redesSociais.filter((_: string, i: number) => i !== index);
    form.setValue("contato.redesSociais", novasRedes);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Contato</h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...form.register("contato.email")}
          placeholder="email@empresa.com"
        />
        {(form.formState.errors.contato as any)?.email && (
          <p className="text-sm text-destructive">
            {getErrorMessage((form.formState.errors.contato as any)?.email)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="celular">Celular *</Label>
        <InputMask
          mask="(99) 99999-9999"
          {...form.register("contato.celular")}
        >
          {(inputProps: any) => (
            <Input
              {...inputProps}
              id="celular"
              placeholder="(00) 00000-0000"
            />
          )}
        </InputMask>
        {(form.formState.errors.contato as any)?.celular && (
          <p className="text-sm text-destructive">
            {getErrorMessage((form.formState.errors.contato as any)?.celular)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefoneFixo">Telefone Fixo</Label>
        <InputMask
          mask="(99) 9999-9999"
          {...form.register("contato.telefoneFixo")}
        >
          {(inputProps: any) => (
            <Input
              {...inputProps}
              id="telefoneFixo"
              placeholder="(00) 0000-0000"
            />
          )}
        </InputMask>
      </div>

      <div className="space-y-2">
        <Label htmlFor="redeSocial">Redes Sociais</Label>
        <div className="flex gap-2">
          <Input
            id="redeSocial"
            value={redeSocial}
            onChange={(e) => setRedeSocial(e.target.value)}
            placeholder="@usuario ou link"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), adicionarRedeSocial())}
          />
          <Button type="button" onClick={adicionarRedeSocial} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {redesSociais.length > 0 && (
          <div className="mt-2 space-y-2">
            {redesSociais.map((rede: string, index: number) => (
              <div key={index} className="flex items-center justify-between bg-secondary p-2 rounded">
                <span className="text-sm">{rede}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removerRedeSocial(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
