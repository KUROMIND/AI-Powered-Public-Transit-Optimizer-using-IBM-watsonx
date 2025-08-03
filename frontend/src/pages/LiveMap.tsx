import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiService, type Stop, type Alert } from "@/services/api";
import { useApiData } from "@/hooks/useApiData";
import { 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle, 
  Zap,
  Train,
  Bus,
  Navigation as NavigationIcon,
  Filter,
  Loader2
} from "lucide-react";

const LiveMap = () => {
  // API Integration: Replace mock data with real API calls
  const { data: stops, loading: stopsLoading, error: stopsError } = useApiData(() => apiService.getStops());
  const { data: alerts, loading: alertsLoading, error: alertsError } = useApiData(() => apiService.getAlerts());
  
  // TODO: Connect to real vehicle tracking API endpoint when available
  const mockVehicles = [
    { id: 1, type: "BART", line: "Richmond", location: "MacArthur", status: "On Time", capacity: 65, nextStop: "19th St Oakland", eta: "3 min" },
    { id: 2, type: "Muni", line: "38 Geary", location: "Union Square", status: "Delayed", capacity: 85, nextStop: "Powell St", eta: "8 min" },
    { id: 3, type: "Caltrain", line: "Baby Bullet", location: "Millbrae", status: "On Time", capacity: 45, nextStop: "San Francisco", eta: "12 min" },
    { id: 4, type: "AC Transit", line: "72", location: "Bay Bridge", status: "On Time", capacity: 70, nextStop: "Transbay Terminal", eta: "6 min" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Time": return "bg-status-good-service text-primary-foreground";
      case "Delayed": return "bg-warning text-warning-foreground";
      case "Disrupted": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCapacityColor = (capacity: number) => {
    if (capacity > 80) return "text-destructive";
    if (capacity > 60) return "text-warning";
    return "text-status-good-service";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Live Transit Map</h1>
            <p className="text-muted-foreground">Real-time vehicle positions and system status</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
              Filter Routes
            </Button>
            <Button variant="transit" size="sm">
              <Zap className="w-4 h-4" />
              Live View
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Area (Placeholder) */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <div className="bg-gradient-to-br from-primary/10 to-primary-glow/5 h-full rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Map placeholder with grid pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{
                      backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>
                  
                  {/* Mock transit lines */}
                  <div className="absolute inset-0 p-8">
                    {/* BART line */}
                    <div className="absolute top-20 left-20 w-64 h-1 bg-transit-rail rounded"></div>
                    {/* Muni line */}
                    <div className="absolute top-40 left-16 w-48 h-1 bg-transit-bus rounded transform rotate-45"></div>
                    {/* Caltrain line */}
                    <div className="absolute bottom-32 left-12 w-72 h-1 bg-accent rounded"></div>
                    
                    {/* Mock vehicle positions */}
                    <div className="absolute top-20 left-32 w-3 h-3 bg-transit-rail rounded-full animate-pulse"></div>
                    <div className="absolute top-40 left-28 w-3 h-3 bg-transit-bus rounded-full animate-pulse"></div>
                    <div className="absolute bottom-32 left-24 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="text-center z-10">
                    {stopsLoading ? (
                      <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
                    ) : (
                      <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                    )}
                    <h3 className="text-xl font-semibold text-foreground mb-2">Interactive Transit Map</h3>
                    <p className="text-muted-foreground">
                      {stopsLoading ? "Loading transit stops..." : 
                       stopsError ? "Error loading stops data" :
                       stops ? `${stops.length} transit stops loaded` : 
                       "Live vehicle tracking and route visualization"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {stopsError ? "Demo only - API integration required" : "Map integration coming soon"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Vehicle Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <NavigationIcon className="w-5 h-5" />
                  Live Vehicles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {vehicle.type === "BART" && <Train className="w-4 h-4 text-transit-rail" />}
                        {vehicle.type === "Muni" && <Bus className="w-4 h-4 text-transit-bus" />}
                        {vehicle.type === "Caltrain" && <Train className="w-4 h-4 text-accent" />}
                        {vehicle.type === "AC Transit" && <Bus className="w-4 h-4 text-warning" />}
                        <span className="font-medium text-sm">{vehicle.line}</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Current: {vehicle.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Next: {vehicle.nextStop} ({vehicle.eta})
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className={`w-3 h-3 ${getCapacityColor(vehicle.capacity)}`} />
                        Capacity: {vehicle.capacity}%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Alerts - API Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Current Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alertsLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading alerts...</span>
                  </div>
                ) : alertsError ? (
                  <div className="border-l-4 border-l-destructive pl-3 py-2">
                    <h4 className="font-medium text-sm text-destructive">API Error</h4>
                    <p className="text-xs text-muted-foreground">Unable to load alerts. Using demo data.</p>
                  </div>
                ) : alerts && alerts.length > 0 ? (
                  alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className={`border-l-4 pl-3 py-2 ${
                      alert.severity === 'high' ? 'border-l-destructive' :
                      alert.severity === 'medium' ? 'border-l-warning' : 'border-l-primary'
                    }`}>
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="border-l-4 border-l-status-good-service pl-3 py-2">
                    <h4 className="font-medium text-sm">All Clear</h4>
                    <p className="text-xs text-muted-foreground">No active alerts at this time</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;