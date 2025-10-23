import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Video, Camera, Users, Lock, Share2, AlertCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalCameras: 0,
    activeCameras: 0,
    sharedCameras: 0,
    blockedCameras: 0,
    totalClients: 0,
    activeClients: 0,
    blockedClients: 0,
    totalVideos: 0,
    totalHours: 0,
    totalMinutes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      // Get total clients
      const { count: totalClients } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true });

      // Get active clients
      const { count: activeClients } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      // Get blocked clients
      const { count: blockedClients } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("status", "blocked");

      // Get total cameras
      const { count: totalCameras } = await supabase
        .from("cameras")
        .select("*", { count: "exact", head: true });

      // Get active cameras (online)
      const { count: activeCameras } = await supabase
        .from("cameras")
        .select("*", { count: "exact", head: true })
        .eq("status", "online");

      // Get blocked cameras (offline)
      const { count: blockedCameras } = await supabase
        .from("cameras")
        .select("*", { count: "exact", head: true })
        .eq("status", "offline");

      // Get total videos
      const { count: totalVideos } = await supabase
        .from("videos")
        .select("*", { count: "exact", head: true });

      // Calculate total hours and minutes from videos
      const { data: videosData } = await supabase
        .from("videos")
        .select("duration");

      const totalSeconds = videosData?.reduce((acc, video) => acc + (video.duration || 0), 0) || 0;
      const totalHours = Math.floor(totalSeconds / 3600);
      const totalMinutes = Math.floor((totalSeconds % 3600) / 60);

      setMetrics({
        totalCameras: totalCameras || 0,
        activeCameras: activeCameras || 0,
        sharedCameras: 0, // TODO: Implement shared cameras logic
        blockedCameras: blockedCameras || 0,
        totalClients: totalClients || 0,
        activeClients: activeClients || 0,
        blockedClients: blockedClients || 0,
        totalVideos: totalVideos || 0,
        totalHours,
        totalMinutes,
      });
    } catch (error) {
      console.error("Error loading metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Dashboard Administrativo">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(10)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-20 bg-muted rounded"></div>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard Administrativo">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Câmeras"
          value={metrics.totalCameras}
          icon={<Camera className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <MetricCard
          title="Câmeras Ativas"
          value={metrics.activeCameras}
          icon={<Camera className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <MetricCard
          title="Câmeras Compartilhadas"
          value={metrics.sharedCameras}
          icon={<Share2 className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
        <MetricCard
          title="Câmeras Bloqueadas"
          value={metrics.blockedCameras}
          icon={<Lock className="w-6 h-6 text-white" />}
          color="bg-red-500"
        />
        <MetricCard
          title="Total de Clientes"
          value={metrics.totalClients}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <MetricCard
          title="Clientes Ativos"
          value={metrics.activeClients}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <MetricCard
          title="Clientes Bloqueados"
          value={metrics.blockedClients}
          icon={<AlertCircle className="w-6 h-6 text-white" />}
          color="bg-red-500"
        />
        <MetricCard
          title="Total de Vídeos"
          value={metrics.totalVideos}
          icon={<Video className="w-6 h-6 text-white" />}
          color="bg-indigo-500"
        />
        <MetricCard
          title="Total de Horas Gravadas"
          value={`${metrics.totalHours}h`}
          icon={<Clock className="w-6 h-6 text-white" />}
          color="bg-orange-500"
        />
        <MetricCard
          title="Minutos Gravados"
          value={`${metrics.totalMinutes}min`}
          icon={<Clock className="w-6 h-6 text-white" />}
          color="bg-yellow-500"
        />
      </div>
    </DashboardLayout>
  );
}
