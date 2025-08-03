import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  status?: "good" | "warning" | "error";
  trend?: "up" | "down" | "stable";
}

const StatusCard = ({ title, value, description, icon: Icon, status = "good", trend }: StatusCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "bg-status-good-service text-primary-foreground";
      case "warning": return "bg-warning text-warning-foreground";
      case "error": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up": return "↗";
      case "down": return "↘";
      case "stable": return "→";
      default: return "";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${getStatusColor(status)}`}>
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          {trend && (
            <Badge variant="secondary" className="text-xs">
              {getTrendIcon(trend)} {trend}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;