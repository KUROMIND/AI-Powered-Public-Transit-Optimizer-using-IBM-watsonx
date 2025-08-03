import Navigation from "@/components/Navigation";
import StatusCard from "@/components/StatusCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/api";
import { useApiData } from "@/hooks/useApiData";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Activity, 
  Train,
  Bus,
  AlertTriangle,
  BarChart3,
  Download,
  Calendar,
  Loader2
} from "lucide-react";

const Dashboard = () => {
  // API Integration: Load system status and analytics data
  const { data: systemStatus, loading: statusLoading, error: statusError } = useApiData(() => apiService.getSystemStatus());
  const { data: routes, loading: routesLoading, error: routesError } = useApiData(() => apiService.getRoutes());
  const { data: stops, loading: stopsLoading, error: stopsError } = useApiData(() => apiService.getStops());
  
  // Mock data for charts and analytics (fallback data)
  const ridership = [
    { time: "6:00", passengers: 1200 },
    { time: "7:00", passengers: 3400 },
    { time: "8:00", passengers: 5600 },
    { time: "9:00", passengers: 4200 },
    { time: "10:00", passengers: 2800 },
    { time: "11:00", passengers: 2400 },
    { time: "12:00", passengers: 3200 }
  ];

  const predictions = [
    { route: "BART Richmond", predicted: "High demand", confidence: 94, capacity: "85%" },
    { route: "Muni 38 Geary", predicted: "Normal demand", confidence: 87, capacity: "65%" },
    { route: "Caltrain Express", predicted: "Low demand", confidence: 92, capacity: "45%" },
    { route: "AC Transit 72", predicted: "High demand", confidence: 88, capacity: "78%" }
  ];

  const getCapacityColor = (capacity: string) => {
    const num = parseInt(capacity);
    if (num > 80) return "text-destructive";
    if (num > 60) return "text-warning";
    return "text-status-good-service";
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "High demand": return "text-destructive";
      case "Normal demand": return "text-status-good-service";
      case "Low demand": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              AI-powered insights and operational forecasts
              {(statusError || routesError || stopsError) && (
                <span className="text-destructive"> (Demo Mode - API Integration Required)</span>
              )}
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4" />
              Date Range
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            {(statusLoading || routesLoading || stopsLoading) && (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatusCard
            title="Active Routes"
            value={routes ? routes.length.toString() : "47"}
            description={routesLoading ? "Loading..." : routesError ? "Demo data" : "Lines operating"}
            icon={Train}
            status="good"
            trend="stable"
          />
          <StatusCard
            title="Transit Stops"
            value={stops ? stops.length.toString() : "284"}
            description={stopsLoading ? "Loading..." : stopsError ? "Demo data" : "Stops in system"}
            icon={Users}
            status="good"
            trend="stable"
          />
          <StatusCard
            title="System Status"
            value={systemStatus?.health || "94.8%"}
            description={statusLoading ? "Loading..." : statusError ? "Demo data" : "Overall health"}
            icon={Activity}
            status="good"
            trend="up"
          />
          <StatusCard
            title="API Status"
            value={statusError ? "Offline" : "Online"}
            description={statusError ? "Using demo data" : "Live data feed"}
            icon={AlertTriangle}
            status={statusError ? "warning" : "good"}
            trend="stable"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ridership Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Hourly Ridership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {ridership.map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1">
                    <div 
                      className="bg-primary w-full rounded-t"
                      style={{ 
                        height: `${(data.passengers / Math.max(...ridership.map(r => r.passengers))) * 200}px`,
                        minHeight: "20px"
                      }}
                    ></div>
                    <div className="text-xs text-muted-foreground text-center">
                      <div>{data.time}</div>
                      <div className="font-medium">{data.passengers}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Predictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                AI Demand Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((pred, index) => (
                  <div key={index} className="border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {pred.route.includes("BART") && <Train className="w-4 h-4 text-transit-rail" />}
                        {pred.route.includes("Muni") && <Bus className="w-4 h-4 text-transit-bus" />}
                        {pred.route.includes("Caltrain") && <Train className="w-4 h-4 text-accent" />}
                        {pred.route.includes("AC Transit") && <Bus className="w-4 h-4 text-warning" />}
                        <span className="font-medium text-sm">{pred.route}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {pred.confidence}% confidence
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium ${getDemandColor(pred.predicted)}`}>
                        {pred.predicted}
                      </span>
                      <span className={`${getCapacityColor(pred.capacity)}`}>
                        Capacity: {pred.capacity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Route Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">BART System</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-status-good-service"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">94%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Muni Buses</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-warning"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">87%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Caltrain</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-full h-full bg-status-good-service"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">96%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">AC Transit</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-status-good-service"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">91%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Peak Hours Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Peak Hours Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Evening Rush</span>
                    <Badge variant="destructive" className="text-xs">High Demand</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">5:00 PM - 7:00 PM: Expect high ridership</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Mid-day</span>
                    <Badge variant="secondary" className="bg-warning text-warning-foreground text-xs">Moderate</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">11:00 AM - 3:00 PM: Steady demand</p>
                </div>
                <div className="p-3 bg-status-good-service/10 rounded-lg border border-status-good-service/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Late Evening</span>
                    <Badge variant="outline" className="text-xs">Low Demand</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">9:00 PM - 11:00 PM: Light ridership</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-status-good-service mb-1">92.4%</div>
                  <p className="text-sm text-muted-foreground">Overall System Health</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>On-time Performance</span>
                    <span className="text-status-good-service">94.2%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Vehicle Reliability</span>
                    <span className="text-status-good-service">96.8%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Service Coverage</span>
                    <span className="text-warning">87.5%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Customer Satisfaction</span>
                    <span className="text-status-good-service">91.3%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;