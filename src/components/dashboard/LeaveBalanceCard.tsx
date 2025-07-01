
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertTriangle } from "lucide-react";

interface LeaveBalance {
  id: string;
  leaveType: string;
  totalAllocated: number;
  usedDays: number;
  pendingDays: number;
  availableDays: number;
}

interface LeaveBalanceCardProps {
  balances: LeaveBalance[];
}

const LeaveBalanceCard = ({ balances }: LeaveBalanceCardProps) => {
  const getUsageColor = (used: number, total: number) => {
    const percentage = (used / total) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = (used: number, total: number) => {
    const percentage = (used / total) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span>Leave Balance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {balances.map((balance) => (
            <div key={balance.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{balance.leaveType}</h4>
                <Badge variant="outline" className="text-xs">
                  {balance.availableDays}/{balance.totalAllocated} days
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used: {balance.usedDays} days</span>
                  <span className="text-gray-600">Pending: {balance.pendingDays} days</span>
                </div>
                
                <div className="relative">
                  <Progress 
                    value={(balance.usedDays / balance.totalAllocated) * 100} 
                    className="h-2"
                  />
                  {balance.pendingDays > 0 && (
                    <div 
                      className="absolute top-0 h-2 bg-yellow-300 opacity-60 rounded"
                      style={{
                        left: `${(balance.usedDays / balance.totalAllocated) * 100}%`,
                        width: `${(balance.pendingDays / balance.totalAllocated) * 100}%`
                      }}
                    />
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className={getUsageColor(balance.usedDays, balance.totalAllocated)}>
                    {Math.round((balance.usedDays / balance.totalAllocated) * 100)}% used
                  </span>
                  {balance.availableDays <= 2 && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Low balance</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveBalanceCard;
