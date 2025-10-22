import { z } from "zod";

// Validação de CNPJ
const validarCNPJ = (cnpj: string) => {
  cnpj = cnpj.replace(/[^\d]+/g, "");
  if (cnpj.length !== 14) return false;
  
  // Elimina CNPJs inválidos conhecidos
  if (/^(\d)\1+$/.test(cnpj)) return false;
  
  // Valida DVs
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === parseInt(digitos.charAt(1));
};

export const dadosEmpresaSchema = z.object({
  razaoSocial: z.string().min(3, "Razão social deve ter no mínimo 3 caracteres"),
  cnpj: z.string().refine((val) => validarCNPJ(val), "CNPJ inválido"),
  areaAtuacao: z.string().min(3, "Área de atuação deve ter no mínimo 3 caracteres"),
});

export const dadosContatoSchema = z.object({
  email: z.string().email("Email inválido"),
  celular: z.string().min(15, "Celular inválido"),
  telefoneFixo: z.string().optional(),
  redesSociais: z.array(z.string()).optional(),
});

export const dadosEnderecoSchema = z.object({
  cep: z.string().length(9, "CEP inválido"),
  rua: z.string().min(3, "Rua deve ter no mínimo 3 caracteres"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro deve ter no mínimo 2 caracteres"),
  cidade: z.string().min(2, "Cidade deve ter no mínimo 2 caracteres"),
  estado: z.string().length(2, "Estado inválido"),
});

export const dadosAcessoSchema = z.object({
  nomeUsuario: z.string().min(3, "Nome de usuário deve ter no mínimo 3 caracteres"),
  senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  confirmarSenha: z.string().min(8, "Confirme a senha"),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

export const cadastroCompleto = z.object({
  empresa: dadosEmpresaSchema,
  contato: dadosContatoSchema,
  endereco: dadosEnderecoSchema,
  acesso: dadosAcessoSchema,
});

export type CadastroCompleto = z.infer<typeof cadastroCompleto>;
