import { UseFormReturn } from "react-hook-form";
import InputMask from "react-input-mask";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DadosEnderecoProps {
  form: UseFormReturn<any>;
}

export function DadosEndereco({ form }: DadosEnderecoProps) {
  const { toast } = useToast();

  const getErrorMessage = (error: any) => {
    return error?.message ? String(error.message) : "";
  };

  const buscarCEP = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        if (response.data.erro) {
          toast({
            title: "CEP não encontrado",
            variant: "destructive",
          });
          return;
        }
        form.setValue("endereco.rua", response.data.logradouro);
        form.setValue("endereco.bairro", response.data.bairro);
        form.setValue("endereco.cidade", response.data.localidade);
        form.setValue("endereco.estado", response.data.uf);
      } catch (error) {
        toast({
          title: "Erro ao buscar CEP",
          description: "Tente novamente mais tarde",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Endereço</h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cep">CEP *</Label>
        <InputMask
          mask="99999-999"
          {...form.register("endereco.cep")}
          onBlur={(e) => buscarCEP(e.target.value)}
        >
          {(inputProps: any) => (
            <Input
              {...inputProps}
              id="cep"
              placeholder="00000-000"
            />
          )}
        </InputMask>
        {(form.formState.errors.endereco as any)?.cep && (
          <p className="text-sm text-destructive">
            {getErrorMessage((form.formState.errors.endereco as any)?.cep)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="rua">Rua *</Label>
          <Input
            id="rua"
            {...form.register("endereco.rua")}
            placeholder="Nome da rua"
          />
          {(form.formState.errors.endereco as any)?.rua && (
            <p className="text-sm text-destructive">
              {getErrorMessage((form.formState.errors.endereco as any)?.rua)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="numero">Número *</Label>
          <Input
            id="numero"
            {...form.register("endereco.numero")}
            placeholder="123"
          />
          {(form.formState.errors.endereco as any)?.numero && (
            <p className="text-sm text-destructive">
              {getErrorMessage((form.formState.errors.endereco as any)?.numero)}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="complemento">Complemento</Label>
        <Input
          id="complemento"
          {...form.register("endereco.complemento")}
          placeholder="Apto, sala, etc"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bairro">Bairro *</Label>
        <Input
          id="bairro"
          {...form.register("endereco.bairro")}
          placeholder="Nome do bairro"
        />
        {(form.formState.errors.endereco as any)?.bairro && (
          <p className="text-sm text-destructive">
            {getErrorMessage((form.formState.errors.endereco as any)?.bairro)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade *</Label>
          <Input
            id="cidade"
            {...form.register("endereco.cidade")}
            placeholder="Nome da cidade"
          />
          {(form.formState.errors.endereco as any)?.cidade && (
            <p className="text-sm text-destructive">
              {getErrorMessage((form.formState.errors.endereco as any)?.cidade)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado *</Label>
          <Input
            id="estado"
            {...form.register("endereco.estado")}
            placeholder="UF"
            maxLength={2}
          />
          {(form.formState.errors.endereco as any)?.estado && (
            <p className="text-sm text-destructive">
              {getErrorMessage((form.formState.errors.endereco as any)?.estado)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
