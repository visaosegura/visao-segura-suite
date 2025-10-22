import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const clientSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  documentType: z.enum(["cpf", "cnpj"]),
  document: z.string().min(11, "Documento inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  contract: z.string().optional(),
  cep: z.string().min(8, "CEP inválido"),
  address: z.string().min(3, "Endereço inválido"),
  number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro inválido"),
  city: z.string().min(2, "Cidade inválida"),
  state: z.string().min(2, "Estado inválido"),
});

type ClientForm = z.infer<typeof clientSchema>;

interface NewClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClientForm) => void;
}

export function NewClientModal({ open, onOpenChange, onSubmit }: NewClientModalProps) {
  const [step, setStep] = useState(1);
  const [documentType, setDocumentType] = useState<"cpf" | "cnpj">("cpf");
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      documentType: "cpf",
    },
  });

  const cep = watch("cep");

  const handleCepBlur = async () => {
    if (cep?.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setValue("address", data.logradouro);
          setValue("neighborhood", data.bairro);
          setValue("city", data.localidade);
          setValue("state", data.uf);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleFormSubmit = (data: ClientForm) => {
    onSubmit(data);
    reset();
    setStep(1);
  };

  const handleClose = () => {
    reset();
    setStep(1);
    onOpenChange(false);
  };

  const progress = (step / 2) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha as informações do cliente em 2 etapas
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm text-muted-foreground">
            <span>Etapa {step} de 2</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de documento *</Label>
                  <Select
                    value={documentType}
                    onValueChange={(value: "cpf" | "cnpj") => {
                      setDocumentType(value);
                      setValue("documentType", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpf">CPF</SelectItem>
                      <SelectItem value="cnpj">CNPJ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document">
                    {documentType === "cpf" ? "CPF" : "CNPJ"} *
                  </Label>
                  <Input
                    id="document"
                    placeholder={documentType === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
                    {...register("document")}
                  />
                  {errors.document && (
                    <p className="text-sm text-destructive">{errors.document.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contract">Contrato (opcional)</Label>
                <Input id="contract" {...register("contract")} />
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={handleNext}>
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  placeholder="00000-000"
                  {...register("cep")}
                  onBlur={handleCepBlur}
                  disabled={isLoadingCep}
                />
                {errors.cep && (
                  <p className="text-sm text-destructive">{errors.cep.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address">Endereço *</Label>
                  <Input id="address" {...register("address")} />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Número *</Label>
                  <Input id="number" {...register("number")} />
                  {errors.number && (
                    <p className="text-sm text-destructive">{errors.number.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input id="complement" {...register("complement")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input id="neighborhood" {...register("neighborhood")} />
                {errors.neighborhood && (
                  <p className="text-sm text-destructive">{errors.neighborhood.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input id="city" {...register("city")} />
                  {errors.city && (
                    <p className="text-sm text-destructive">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Input id="state" {...register("state")} maxLength={2} />
                  {errors.state && (
                    <p className="text-sm text-destructive">{errors.state.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="secondary" onClick={handleBack}>
                  Voltar
                </Button>
                <Button type="submit">Finalizar</Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}