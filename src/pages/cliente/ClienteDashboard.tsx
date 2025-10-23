import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Video, Bell, Search, Play } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface CameraCardProps {
  name: string;
  location: string;
  status: "online" | "offline";
  thumbnail?: string;
}

function CameraCard({ name, location, status, thumbnail }: CameraCardProps) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-slate-200 rounded-lg mb-3 flex items-center justify-center">
        {thumbnail ? (
          <img src={thumbnail} alt={name} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <Camera className="w-12 h-12 text-slate-400" />
        )}
      </div>
      <h3 className="font-semibold mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground mb-3">{location}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full ${status === "online" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}>
          {status === "online" ? "● Online" : "● Offline"}
        </span>
        <div className="flex gap-2">
          <Button size="sm" className="bg-gradient-to-r from-orange-500 to-orange-600">
            <Play className="w-3 h-3 mr-1" />
            Ao Vivo
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function ClienteDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [metrics, setMetrics] = useState({
    totalCameras: 0,
    onlineCameras: 0,
    todayRecordings: 0,
    recentAlerts: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      // Get user's clients
      const { data: userClients } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", currentUser.id);

      if (!userClients || userClients.length === 0) {
        setMetrics({
          totalCameras: 0,
          onlineCameras: 0,
          todayRecordings: 0,
          recentAlerts: 0,
        });
        return;
      }

      const clientIds = userClients.map(c => c.id);

      // Get cameras for user's clients
      const { data: cameras, count: totalCameras } = await supabase
        .from("cameras")
        .select("*", { count: "exact" })
        .in("client_id", clientIds);

      // Count online cameras
      const onlineCameras = cameras?.filter(c => c.status === "online").length || 0;

      // Get camera IDs
      const cameraIds = cameras?.map(c => c.id) || [];

      // Get today's videos
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayRecordings } = await supabase
        .from("videos")
        .select("*", { count: "exact", head: true })
        .in("camera_id", cameraIds)
        .gte("recorded_at", today.toISOString());

      // Get recent alerts (last 24 hours)
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);

      const { count: recentAlerts } = await supabase
        .from("ai_detections")
        .select("video_id", { count: "exact", head: true })
        .gte("created_at", last24Hours.toISOString());

      setMetrics({
        totalCameras: totalCameras || 0,
        onlineCameras,
        todayRecordings: todayRecordings || 0,
        recentAlerts: recentAlerts || 0,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const userName = user?.user_metadata?.razao_nome || "Usuário";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/assets/logo.png" alt="Visão Segura" className="h-8" />
            <h1 className="text-xl font-semibold">Olá, {userName}!</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Minhas Câmeras</p>
                <p className="text-3xl font-bold">{metrics.totalCameras}</p>
                <Button variant="link" className="p-0 h-auto text-orange-500 mt-2">
                  Ver Todas
                </Button>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Câmeras Online</p>
                <p className="text-3xl font-bold">{metrics.onlineCameras}</p>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full mt-2">
                  ● Ao Vivo
                </span>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <Camera className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Gravações Hoje</p>
                <p className="text-3xl font-bold">{metrics.todayRecordings}</p>
                <Button variant="link" className="p-0 h-auto text-orange-500 mt-2">
                  Ver Gravações
                </Button>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Alertas Recentes</p>
                <p className="text-3xl font-bold">{metrics.recentAlerts}</p>
                <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full mt-2">
                  24h
                </span>
              </div>
              <div className="p-3 rounded-lg bg-orange-100">
                <Bell className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* My Cameras Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Minhas Câmeras</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar câmeras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Empty state */}
            <Card className="p-8 col-span-full text-center">
              <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma câmera cadastrada ainda</p>
            </Card>
          </div>
        </div>

        {/* Recent Alerts Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Alertas de IA - Últimas 24h</h2>
            <Button variant="link" className="text-orange-500">
              Ver Todos os Alertas
            </Button>
          </div>

          <Card className="p-8 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum alerta nas últimas 24 horas</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
