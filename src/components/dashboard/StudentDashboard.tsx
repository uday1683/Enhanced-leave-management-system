
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, FileText, LogOut, Plus, User } from "lucide-react";
import LeaveRequestForm from "./LeaveRequestForm";

interface User {
  id: string;
  username: string;
  role: 'STUDENT' | 'ADMIN';
  name: string;
}

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedDate: string;
}

const StudentDashboard = ({ user, onLogout }: StudentDashboardProps) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      type: 'Sick Leave',
      startDate: '2024-07-15',
      endDate: '2024-07-17',
      reason: 'Medical appointment and recovery',
      status: 'APPROVED',
      submittedDate: '2024-07-10'
    },
    {
      id: '2',
      type: 'Personal Leave',
      startDate: '2024-07-20',
      endDate: '2024-07-20',
      reason: 'Family emergency',
      status: 'PENDING',
      submittedDate: '2024-07-12'
    }
  ]);

  const [showForm, setShowForm] = useState(false);

  const handleNewRequest = (request: Omit<LeaveRequest, 'id' | 'status' | 'submittedDate'>) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: Date.now().toString(),
      status: 'PENDING',
      submittedDate: new Date().toISOString().split('T')[0]
    };
    setLeaveRequests([newRequest, ...leaveRequests]);
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const pendingCount = leaveRequests.filter(req => req.status === 'PENDING').length;
  const approvedCount = leaveRequests.filter(req => req.status === 'APPROVED').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
                <p className="text-gray-600">Student Dashboard</p>
              </div>
            </div>
            <Button 
              onClick={onLogout}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-3xl font-bold text-gray-900">{leaveRequests.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="requests" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="requests">My Requests</TabsTrigger>
              <TabsTrigger value="new">New Request</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="requests" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>Leave Requests History</CardTitle>
                <CardDescription>
                  View and track all your leave requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 bg-white/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{request.type}</h3>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                        <div>
                          <span className="font-medium">Start Date:</span> {request.startDate}
                        </div>
                        <div>
                          <span className="font-medium">End Date:</span> {request.endDate}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Reason:</span> {request.reason}
                      </p>
                      <p className="text-xs text-gray-500">
                        Submitted on {request.submittedDate}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>Submit New Leave Request</CardTitle>
                <CardDescription>
                  Fill out the form below to submit a new leave request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LeaveRequestForm onSubmit={handleNewRequest} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
