import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/services/api";
import { useApiData } from "@/hooks/useApiData";
import { 
  Route, 
  Clock, 
  DollarSign, 
  Users, 
  MapPin,
  ArrowRight,
  Train,
  Bus,
  PersonStanding,
  Zap,
  Loader2
} from "lucide-react";

const RoutePlanner = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  // API Integration: Load stops and routes for autocomplete
  const { data: stops, loading: stopsLoading, error: stopsError } = useApiData(() => apiService.getStops());
  const { data: routes, loading: routesLoading, error: routesError } = useApiData(() => apiService.getRoutes());

  const handlePlanRoute = () => {
    if (fromLocation && toLocation) {
      setShowResults(true);
    }
  };

  const mockRoutes = [
    {
      id: 1,
      duration: "32 min",
      cost: "$4.50",
      transfers: 1,
      walking: "8 min",
      reliability: 94,
      steps: [
        { type: "walk", description: "Walk to Powell St Station", duration: "3 min", icon: PersonStanding },
        { type: "bart", description: "BART Richmond Line to MacArthur", duration: "18 min", icon: Train },
        { type: "transfer", description: "Transfer at MacArthur Station", duration: "2 min", icon: ArrowRight },
        { type: "bus", description: "AC Transit 72 to Downtown Oakland", duration: "9 min", icon: Bus },
        { type: "walk", description: "Walk to destination", duration: "5 min", icon: PersonStanding }
      ]
    },
    {
      id: 2,
      duration: "41 min",
      cost: "$3.25",
      transfers: 0,
      walking: "12 min",
      reliability: 89,
      steps: [
        { type: "walk", description: "Walk to Geary & Powell", duration: "6 min", icon: PersonStanding },
        { type: "bus", description: "Muni 38 Geary to Downtown", duration: "35 min", icon: Bus },
        { type: "walk", description: "Walk to destination", duration: "6 min", icon: PersonStanding }
      ]
    },
    {
      id: 3,
      duration: "28 min",
      cost: "$6.75",
      transfers: 2,
      walking: "15 min",
      reliability: 96,
      steps: [
        { type: "walk", description: "Walk to Caltrain Station", duration: "8 min", icon: PersonStanding },
        { type: "train", description: "Caltrain to 4th & King", duration: "12 min", icon: Train },
        { type: "transfer", description: "Transfer to Muni", duration: "3 min", icon: ArrowRight },
        { type: "bus", description: "Muni T-Third to destination area", duration: "8 min", icon: Bus },
        { type: "walk", description: "Walk to destination", duration: "5 min", icon: PersonStanding }
      ]
    }
  ];

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 95) return "text-status-good-service";
    if (reliability >= 90) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Route Planner</h1>
          <p className="text-muted-foreground">AI-powered route suggestions with real-time data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route Input */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="w-5 h-5" />
                  Plan Your Trip
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <Input
                    id="from"
                    placeholder="Enter starting location"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    placeholder="Enter destination"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handlePlanRoute} 
                  className="w-full" 
                  variant="transit"
                  disabled={!fromLocation || !toLocation}
                >
                  <Zap className="w-4 h-4" />
                  Find Best Routes
                </Button>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium mb-2">Quick Options</h4>
                  <div className="space-y-2">
                    {stopsLoading ? (
                      <div className="flex items-center gap-2 py-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span className="text-xs text-muted-foreground">Loading stops...</span>
                      </div>
                    ) : stops && stops.length >= 6 ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-xs"
                          onClick={() => {
                            setFromLocation(stops[0].name);
                            setToLocation(stops[1].name);
                          }}
                        >
                          <MapPin className="w-3 h-3" />
                          {stops[0].name} → {stops[1].name}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-xs"
                          onClick={() => {
                            setFromLocation(stops[2].name);
                            setToLocation(stops[3].name);
                          }}
                        >
                          <MapPin className="w-3 h-3" />
                          {stops[2].name} → {stops[3].name}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-xs"
                          onClick={() => {
                            setFromLocation(stops[4].name);
                            setToLocation(stops[5].name);
                          }}
                        >
                          <MapPin className="w-3 h-3" />
                          {stops[4].name} → {stops[5].name}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                          <MapPin className="w-3 h-3" />
                          Current Location → SFO Airport
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                          <MapPin className="w-3 h-3" />
                          Downtown SF → UC Berkeley
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                          <MapPin className="w-3 h-3" />
                          Oakland → Palo Alto
                        </Button>
                      </>
                    )}
                  </div>
                  {stopsError && (
                    <p className="text-xs text-destructive mt-2">
                      Demo only - API integration required for live stops
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Route Results */}
          <div className="lg:col-span-2">
            {showResults ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Route Options</h2>
                  <Badge variant="secondary" className="text-xs">
                    Updated {new Date().toLocaleTimeString()}
                  </Badge>
                </div>

                {mockRoutes.map((route, index) => (
                  <Card key={route.id} className={`hover:shadow-md transition-shadow ${index === 0 ? 'border-primary' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {index === 0 && (
                            <Badge variant="default" className="bg-status-good-service text-primary-foreground">
                              Recommended
                            </Badge>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">{route.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{route.cost}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{route.transfers} transfers</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`font-medium ${getReliabilityColor(route.reliability)}`}>
                                {route.reliability}% reliable
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Select Route
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {route.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-center gap-2 min-w-fit">
                            <div className="flex flex-col items-center gap-1">
                              <div className="bg-muted p-2 rounded-full">
                                <step.icon className="w-3 h-3" />
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {step.duration}
                              </span>
                            </div>
                            {stepIndex < route.steps.length - 1 && (
                              <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 space-y-1">
                        {route.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="text-xs text-muted-foreground">
                            {stepIndex + 1}. {step.description}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="h-[400px]">
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Route className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Plan Your Route</h3>
                    <p className="text-muted-foreground">Enter your starting point and destination to see AI-powered route suggestions</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;