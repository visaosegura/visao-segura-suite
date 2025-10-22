import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Camera, Activity, Video } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total de Clientes",
      value: "127",
      icon: Users,
      trend: "+12% vs mês anterior",
    },
    {
      title: "Câmeras Ativas",
      value: "1,234",
      icon: Camera,
      trend: "+5% vs mês anterior",
    },
    {
      title: "Eventos Hoje",
      value: "3,456",
      icon: Activity,
      trend: "+8% vs ontem",
    },
    {
      title: "Gravações (TB)",
      value: "156",
      icon: Video,
      trend: "+15% vs mês anterior",
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao Visão Segura</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Sistema de gestão de monitoramento por câmeras. Use o menu lateral para navegar
              entre as funcionalidades.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;