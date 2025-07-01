import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Clock, FileText, LogOut, Shield, Users, Search, Filter, AlertTriangle, TrendingUp } from "lucide-react";
import NotificationCenter from "../notifications/NotificationCenter";
import AnalyticsDashboard from "./AnalyticsDashboard";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  role: 'STUDENT' | 'ADMIN';
  name: string;
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

interface LeaveRequest {
  id: string;
  studentName: string;
  studentId: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedDate: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  isUrgent: boolean;
  emergencyContact: string;
  department: string;
  processedAt?: string;
  adminComments?: string;
}

const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const { toast } = useToast();
  
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      studentName: 'John Doe',
      studentId: 'STU001',
      type: 'Sick Leave',
      startDate: '2024-07-15',
      endDate: '2024-07-17',
      reason: 'Medical appointment and recovery',
      status: 'PENDING',
      submittedDate: '2024-07-10',
      priority: 'HIGH',
      isUrgent: true,
      emergencyContact: '+1234567890',
      department: 'Computer Science'
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      studentId: 'STU002',
      type: 'Personal Leave',
      startDate: '2024-07-20',
      endDate: '2024-07-20',
      reason: 'Family emergency',
      status: 'PENDING',
      submittedDate: '2024-07-12',
      priority: 'URGENT',
      isUrgent: true,
      emergencyContact: '+1234567891',
      department: 'Mathematics'
    },
    {
      id: '3',
      studentName: 'Mike Johnson',
      studentId: 'STU003',
      type: 'Medical Leave',
      startDate: '2024-07-08',
      endDate: '2024-07-10',
      reason: 'Surgery recovery',
      status: 'APPROVED',
      submittedDate: '2024-07-05',
      priority: 'HIGH',
      isUrgent: false,
      emergencyContact: '+1234567892',
      department: 'Physics',
      processedAt: '2024-07-06',
      adminComments: 'Approved after medical documentation review'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const handleRequestAction = (requestId: string, action: 'APPROVED' | 'REJECTED', comments?: string) => {
    setLeaveRequests(requests =>
      requests.map(req =>
        req.id === requestId ? { 
          ...req, 
          status: action,
          processedAt: new Date().toISOString().split('T')[0],
          adminComments: comments
        } : req
      )
    );

    const request = leaveRequests.find(req => req.id === requestId);
    toast({
      title: `Leave Request ${action}`,
      description: `${request?.studentName}'s leave request has been ${action.toLowerCase()}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'NORMAL': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter requests based on search and filters
  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || request.status === statusFilter;
    const matchesDepartment = departmentFilter === "ALL" || request.department === departmentFilter;
    const matchesPriority = priorityFilter === "ALL" || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesPriority;
  });

  const pendingRequests = filteredRequests.filter(req => req.status === 'PENDING');
  const urgentRequests = filteredRequests.filter(req => req.isUrgent && req.status === 'PENDING');
  const approvedRequests = filteredRequests.filter(req => req.status === 'APPROVED');
  const rejectedRequests = filteredRequests.filter(req => req.status === 'REJECTED');

  // Mock analytics data
  const analyticsData = {
    monthlyStats: [
      { month: 'Jan', applied: 45, approved: 38, rejected: 7 },
      { month: 'Feb', applied: 52, approved: 44, rejected: 8 },
      { month: 'Mar', applied: 39, approved: 35, rejected: 4 },
      { month: 'Apr', applied: 48, approved: 42, rejected: 6 },
      { month: 'May', applied: 56, approved: 49, rejected: 7 },
      { month: 'Jun', applied: 43, approved: 38, rejected: 5 }
    ],
    departmentStats: [
      { department: 'Computer Science', requests: 78, approvalRate: 88 },
      { department: 'Mathematics', requests: 45, approvalRate: 82 },
      { department: 'Physics', requests: 67, approvalRate: 91 },
      { department: 'Chemistry', requests: 34, approvalRate: 79 }
    ],
    leaveTypeStats: [
      { type: 'Sick Leave', count: 85, color: '#3B82F6' },
      { type: 'Personal Leave', count: 67, color: '#10B981' },
      { type: 'Emergency Leave', count: 34, color: '#F59E0B' },
      { type: 'Medical Leave', count: 23, color: '#EF4444' }
    ],
    recentTrends: {
      totalRequests: 224,
      approvalRate: 86,
      averageProcessingTime: 2.3,
      trendDirection: 'up' as const
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage leave requests and student accounts</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationCenter userId={user.id} />
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
                  <p className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Urgent</p>
                  <p className="text-3xl font-bold text-red-600">{urgentRequests.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{approvedRequests.length}</p>
                </div>
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Students</p>
                  <p className="text-3xl font-bold text-indigo-600">247</p>
                </div>
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by student name, ID, or leave type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Departments</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priority</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="pending" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>Pending Leave Requests</CardTitle>
                <CardDescription>
                  Review and approve or reject student leave requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Urgent requests first */}
                  {urgentRequests.map((request) => (
                    <div key={request.id} className="border-2 border-red-200 rounded-lg p-6 bg-red-50/50">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{request.studentName}</h3>
                          <p className="text-sm text-gray-600">ID: {request.studentId} | {request.department}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                          <Badge className="bg-red-100 text-red-800">
                            URGENT
                          </Badge>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Leave Type</p>
                          <p className="text-gray-900">{request.type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Duration</p>
                          <p className="text-gray-900">{request.startDate} to {request.endDate}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Emergency Contact</p>
                          <p className="text-gray-900">{request.emergencyContact}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Submitted</p>
                          <p className="text-gray-900">{request.submittedDate}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 mb-1">Reason</p>
                        <p className="text-gray-900">{request.reason}</p>
                      </div>
                      
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleRequestAction(request.id, 'APPROVED')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRequestAction(request.id, 'REJECTED')}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Regular pending requests */}
                  {pendingRequests.filter(req => !req.isUrgent).map((request) => (
                    <div key={request.id} className="border rounded-lg p-6 bg-white/50">
                      
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{request.studentName}</h3>
                          <p className="text-sm text-gray-600">ID: {request.studentId} | {request.department}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Leave Type</p>
                          <p className="text-gray-900">{request.type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Duration</p>
                          <p className="text-gray-900">{request.startDate} to {request.endDate}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 mb-1">Reason</p>
                        <p className="text-gray-900">{request.reason}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          Submitted on {request.submittedDate}
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleRequestAction(request.id, 'APPROVED')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRequestAction(request.id, 'REJECTED')}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {pendingRequests.length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No pending requests to review</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>All Leave Requests</CardTitle>
                <CardDescription>
                  Complete history of all leave requests with enhanced filtering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 bg-white/50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.studentName}</h3>
                          <p className="text-sm text-gray-600">{request.type} | {request.department}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                          {request.isUrgent && (
                            <Badge className="bg-red-100 text-red-800">
                              URGENT
                            </Badge>
                          )}
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-2">
                        <div>
                          <span className="font-medium">Student ID:</span> {request.studentId}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {request.startDate} to {request.endDate}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span> {request.submittedDate}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Reason:</span> {request.reason}
                      </p>
                      {request.adminComments && (
                        <p className="text-sm text-blue-700">
                          <span className="font-medium">Admin Comments:</span> {request.adminComments}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard data={analyticsData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
