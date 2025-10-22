import { UseFormReturn } from "react-hook-form";
import InputMask from "react-input-mask";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";

interface DadosEmpresaProps {
  form: UseFormReturn<any>;
}

export function DadosEmpresa({ form }: DadosEmpresaProps) {
  const getErrorMessage = (error: any) => {
    return error?.message ? String(error.message) : "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Dados da Empresa</h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="razaoSocial">Razão Social *</Label>
        <Input
          id="razaoSocial"
          {...form.register("empresa.razaoSocial")}
          placeholder="Nome da empresa"
        />
        {(form.formState.errors.empresa as any)?.razaoSocial && (
          <p className="text-sm text-destructive">
            {getErrorMessage((form.formState.errors.empresa as any)?.razaoSocial)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cnpj">CNPJ *</Label>
        <InputMask
          mask="99.999.999/9999-99"
          {...form.register("empresa.cnpj")}
        >
          {(inputProps: any) => (
            <Input
              {...inputProps}
              id="cnpj"
              placeholder="00.000.000/0000-00"
            />
          )}
        </InputMask>
        {(form.formState.errors.empresa as any)?.cnpj && (
          <p className="text-sm text-destructive">
            {getErrorMessage((form.formState.errors.empresa as any)?.cnpj)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="areaAtuacao">Área de Atuação *</Label>
        <Select
          onValueChange={(value) => form.setValue("empresa.areaAtuacao", value)}
          value={form.watch("empresa.areaAtuacao")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seguranca">Segurança e Monitoramento</SelectItem>
            <SelectItem value="condominios">Condomínios</SelectItem>
            <SelectItem value="varejo">Varejo</SelectItem>
            <SelectItem value="industria">Indústria</SelectItem>
            <SelectItem value="logistica">Logística</SelectItem>
            <SelectItem value="outros">Outros</SelectItem>
          </SelectContent>
        </Select>
        {(form.formState.errors.empresa as any)?.areaAtuacao && (
          <p className="text-sm text-destructive">
            {getErrorMessage((form.formState.errors.empresa as any)?.areaAtuacao)}
          </p>
        )}
      </div>
    </div>
  );
}
