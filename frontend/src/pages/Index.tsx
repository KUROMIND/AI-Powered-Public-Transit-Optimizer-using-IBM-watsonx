import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import StatusCard from "@/components/StatusCard";
import TransitAlert from "@/components/TransitAlert";
import { apiService } from "@/services/api";
import { useApiData } from "@/hooks/useApiData";
import { 
  Train, 
  Users, 
  Clock, 
  Activity, 
  Map, 
  Route, 
  AlertTriangle,
  TrendingUp,
  Bus,
  Navigation as NavigationIcon
} from "lucide-react";

const Index = () => {
  // API Integration: Load system overview data
  const { data: routes, loading: routesLoading, error: routesError } = useApiData(() => apiService.getRoutes());
  const { data: stops, loading: stopsLoading, error: stopsError } = useApiData(() => apiService.getStops());
  const { data: alerts, loading: alertsLoading, error: alertsError } = useApiData(() => apiService.getAlerts());
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 to-primary-glow/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              AI-Powered Bay Area Transit
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Real-time navigation, intelligent route planning, and live transit updates powered by AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/planner">
                <Button variant="transit" size="lg" className="w-full sm:w-auto">
                  <Route className="w-5 h-5" />
                  Plan Your Route
                </Button>
              </Link>
              <Link to="/map">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Map className="w-5 h-5" />
                  View Live Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Status Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatusCard
              title="Active Routes"
              value={routes ? routes.length.toString() : "47"}
              description={routesLoading ? "Loading..." : routesError ? "Demo data" : "Lines operating normally"}
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
              title="API Status"
              value={alertsError ? "Demo Mode" : "Live"}
              description={alertsError ? "Using fallback data" : "Real-time data feed"}
              icon={Activity}
              status={alertsError ? "warning" : "good"}
              trend="stable"
            />
            <StatusCard
              title="System Health"
              value="94.8%"
              description="Overall performance"
              icon={Clock}
              status="good"
              trend="up"
            />
          </div>
        </div>

        {/* Quick Actions & Recent Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Link to="/planner" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <NavigationIcon className="w-4 h-4" />
                    Plan a Route
                  </Button>
                </Link>
                <Link to="/map" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Map className="w-4 h-4" />
                    Live Transit Map
                  </Button>
                </Link>
                <Link to="/alerts" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <AlertTriangle className="w-4 h-4" />
                    Service Alerts
                  </Button>
                </Link>
                <Link to="/dashboard" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <TrendingUp className="w-4 h-4" />
                    Analytics Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold text-foreground mb-4">Recent Alerts</h3>
            <div className="space-y-4">
              {alertsLoading ? (
                <div className="text-center py-4 text-muted-foreground">Loading alerts...</div>
              ) : alerts && alerts.length > 0 ? (
                alerts.slice(0, 3).map((alert) => (
                  <TransitAlert
                    key={alert.id}
                    type={alert.type}
                    title={alert.title}
                    description={alert.description}
                    route={alert.route}
                    time={(() => {
                      const date = new Date(alert.created_at);
                      const now = new Date();
                      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
                      if (diffMinutes < 60) return `${diffMinutes} min ago`;
                      if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
                      return `${Math.floor(diffMinutes / 1440)} days ago`;
                    })()}
                    severity={alert.severity}
                  />
                ))
              ) : (
                <>
                  <TransitAlert
                    type="delay"
                    title="Minor Delays on BART Richmond Line"
                    description="Experiencing 5-8 minute delays due to track maintenance at MacArthur Station."
                    route="Richmond Line"
                    time="15 min ago"
                    severity="medium"
                  />
                  <TransitAlert
                    type="info"
                    title="Weekend Service Changes"
                    description="Modified schedule for Caltrain this weekend. Check alternative routes."
                    route="Caltrain"
                    time="2 hours ago"
                    severity="low"
                  />
                  <TransitAlert
                    type="disruption"
                    title="Bus Route 38 Temporarily Suspended"
                    description="Route suspended due to street closure. Alternative routes via 38R or 1 California."
                    route="Muni 38"
                    time="3 hours ago"
                    severity="high"
                  />
                </>
              )}
              {alertsError && (
                <p className="text-xs text-destructive">Demo data - API integration required for live alerts</p>
              )}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center">How Bay Transit AI Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-4">
                <div className="bg-transit-rail/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Activity className="w-8 h-8 text-transit-rail" />
                </div>
                <h4 className="font-semibold">Real-Time Data</h4>
                <p className="text-sm text-muted-foreground">
                  Aggregates live data from BART, Muni, Caltrain, and other transit agencies
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Bus className="w-8 h-8 text-accent" />
                </div>
                <h4 className="font-semibold">AI Predictions</h4>
                <p className="text-sm text-muted-foreground">
                  Machine learning algorithms predict delays, crowding, and optimal routes
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-transit-bus/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Route className="w-8 h-8 text-transit-bus" />
                </div>
                <h4 className="font-semibold">Smart Routing</h4>
                <p className="text-sm text-muted-foreground">
                  Suggests the fastest, most reliable routes based on current conditions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
