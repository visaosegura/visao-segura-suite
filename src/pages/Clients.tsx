import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info, Pencil, PlusCircle, MoreVertical, Plus, Search } from "lucide-react";
import { NewClientModal } from "@/components/clients/NewClientModal";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockClients = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@empresa.com",
    lastAccess: "2025-01-15 14:30",
    cameras: 5,
    status: "active",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@loja.com",
    lastAccess: "2025-01-14 09:15",
    cameras: 3,
    status: "active",
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@residencial.com",
    lastAccess: null,
    cameras: 8,
    status: "blocked",
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana@comercio.com",
    lastAccess: "2025-01-15 16:45",
    cameras: 2,
    status: "active",
  },
];

const Clients = () => {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<typeof mockClients[0] | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const { toast } = useToast();

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewClient = (data: any) => {
    console.log("New client:", data);
    toast({
      title: "Cliente criado!",
      description: `${data.name} foi adicionado com sucesso.`,
    });
    setIsNewClientOpen(false);
  };

  const handleViewInfo = (client: typeof mockClients[0]) => {
    setSelectedClient(client);
    setIsInfoOpen(true);
  };

  return (
    <DashboardLayout title="Clientes">
      <div className="space-y-6">
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setIsNewClientOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo cliente
          </Button>
        </div>

        {/* Table */}
        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NOME</TableHead>
                <TableHead>ÚLTIMO ACESSO</TableHead>
                <TableHead>CÂMERAS</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="text-right">AÇÕES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.lastAccess || (
                        <span className="text-muted-foreground">Sem acesso</span>
                      )}
                    </TableCell>
                    <TableCell>{client.cameras}</TableCell>
                    <TableCell>
                      <Badge
                        variant={client.status === "active" ? "default" : "destructive"}
                        className={
                          client.status === "active"
                            ? "bg-success hover:bg-success/90"
                            : ""
                        }
                      >
                        {client.status === "active" ? "Ativo" : "Bloqueado"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewInfo(client)}
                        >
                          <Info className="w-4 h-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil className="w-4 h-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-success">
                          <PlusCircle className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Bloquear cliente</DropdownMenuItem>
                            <DropdownMenuItem>Ver gravações</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="text-sm text-muted-foreground">
          Exibindo {filteredClients.length} de {clients.length} registros
        </div>
      </div>

      {/* New Client Modal */}
      <NewClientModal
        open={isNewClientOpen}
        onOpenChange={setIsNewClientOpen}
        onSubmit={handleNewClient}
      />

      {/* Client Info Dialog */}
      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informações do Cliente</DialogTitle>
            <DialogDescription>Detalhes do cliente selecionado</DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div>
                <span className="font-medium">Nome:</span> {selectedClient.name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {selectedClient.email}
              </div>
              <div>
                <span className="font-medium">Câmeras:</span> {selectedClient.cameras}
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                <Badge
                  variant={selectedClient.status === "active" ? "default" : "destructive"}
                >
                  {selectedClient.status === "active" ? "Ativo" : "Bloqueado"}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Clients;