import Navigation from "@/components/Navigation";
import TransitAlert from "@/components/TransitAlert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { apiService } from "@/services/api";
import { useApiData } from "@/hooks/useApiData";
import { 
  AlertTriangle, 
  Filter, 
  Search, 
  Bell,
  CheckCircle,
  Clock,
  Info,
  Loader2
} from "lucide-react";

const Alerts = () => {
  // API Integration: Load alerts from backend
  const { data: alerts, loading: alertsLoading, error: alertsError, refetch } = useApiData(() => apiService.getAlerts());
  
  // Fallback to mock data if API fails
  const mockAlerts = [
    {
      id: "mock-1",
      type: "disruption" as const,
      title: "BART System-Wide Delays",
      description: "All BART lines experiencing 10-15 minute delays due to equipment malfunction at Montgomery Station. Crews are working to resolve the issue.",
      route: "All BART Lines",
      created_at: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
      severity: "high" as const
    },
    {
      id: "mock-2",
      type: "delay" as const,
      title: "Caltrain Express Service Suspended",
      description: "Express service between San Francisco and San Jose suspended until further notice. Local service operating with minor delays.",
      route: "Caltrain Express",
      created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      severity: "medium" as const
    },
    {
      id: "mock-3",
      type: "maintenance" as const,
      title: "Weekend Track Work - Muni Metro",
      description: "N-Judah line will operate on bus substitution this weekend between Ocean Beach and Embarcadero stations.",
      route: "Muni N-Judah",
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      severity: "low" as const
    }
  ];

  // Use real alerts if available, otherwise fall back to mock data
  const displayAlerts = alerts || (alertsError ? mockAlerts : []);
  
  const alertCounts = {
    total: displayAlerts.length,
    high: displayAlerts.filter(a => a.severity === "high").length,
    medium: displayAlerts.filter(a => a.severity === "medium").length,
    low: displayAlerts.filter(a => a.severity === "low").length
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Transit Alerts</h1>
            <p className="text-muted-foreground">Real-time service updates and disruptions</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4" />
              Subscribe
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Alert Summary & Filters */}
          <div className="space-y-4">
            {/* Alert Count Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="w-5 h-5" />
                  Alert Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Alerts</span>
                  <Badge variant="secondary">{alertCounts.total}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-destructive">High Priority</span>
                  <Badge variant="destructive">{alertCounts.high}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-warning">Medium Priority</span>
                  <Badge variant="secondary" className="bg-warning text-warning-foreground">
                    {alertCounts.medium}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-status-good-service">Low Priority</span>
                  <Badge variant="outline">{alertCounts.low}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Search & Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by route or keyword..." className="pl-9" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Filter by Type</h4>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <AlertTriangle className="w-3 h-3 text-destructive" />
                      Disruptions
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <Clock className="w-3 h-3 text-warning" />
                      Delays
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <Info className="w-3 h-3 text-primary" />
                      Information
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <CheckCircle className="w-3 h-3 text-muted-foreground" />
                      Maintenance
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Filter by Agency</h4>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      BART
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      Muni
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      Caltrain
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded" />
                      AC Transit
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert List */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Active Alerts</h2>
              <div className="flex items-center gap-2">
                {alertsError && (
                  <Badge variant="destructive" className="text-xs">Demo Data</Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  Last updated: {new Date().toLocaleTimeString()}
                </Badge>
                <Button variant="outline" size="sm" onClick={refetch} disabled={alertsLoading}>
                  {alertsLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Refresh"}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {alertsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>Loading alerts...</span>
                </div>
              ) : displayAlerts.length > 0 ? (
                displayAlerts.map((alert) => (
                  <TransitAlert
                    key={alert.id}
                    type={alert.type}
                    title={alert.title}
                    description={alert.description}
                    route={alert.route}
                    time={formatTime(alert.created_at)}
                    severity={alert.severity}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-status-good-service" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Active Alerts</h3>
                  <p>All transit services are operating normally.</p>
                </div>
              )}
            </div>

            {/* Load More */}
            <div className="text-center pt-4">
              <Button variant="outline">
                Load More Alerts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;