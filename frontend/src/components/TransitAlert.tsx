import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, Clock, X } from "lucide-react";

interface TransitAlertProps {
  type: "delay" | "disruption" | "info" | "maintenance";
  title: string;
  description: string;
  route?: string;
  time: string;
  severity: "low" | "medium" | "high";
  onDismiss?: () => void;
}

const TransitAlert = ({ type, title, description, route, time, severity, onDismiss }: TransitAlertProps) => {
  const getAlertConfig = (type: string, severity: string) => {
    const configs = {
      delay: {
        icon: Clock,
        color: severity === "high" ? "bg-destructive text-destructive-foreground" : "bg-warning text-warning-foreground"
      },
      disruption: {
        icon: AlertTriangle,
        color: "bg-destructive text-destructive-foreground"
      },
      info: {
        icon: Info,
        color: "bg-primary text-primary-foreground"
      },
      maintenance: {
        icon: Info,
        color: "bg-muted text-muted-foreground"
      }
    };
    
    return configs[type as keyof typeof configs] || configs.info;
  };

  const config = getAlertConfig(type, severity);
  const Icon = config.icon;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  return (
    <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{title}</h3>
                <Badge variant={getSeverityBadge(severity)} className="text-xs">
                  {severity.toUpperCase()}
                </Badge>
              </div>
              {route && (
                <Badge variant="outline" className="text-xs mb-2">
                  {route}
                </Badge>
              )}
            </div>
          </div>
          {onDismiss && (
            <Button variant="ghost" size="icon" onClick={onDismiss} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{time}</span>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransitAlert;