
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, Upload, AlertTriangle, Phone, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface EnhancedLeaveRequestFormProps {
  onSubmit: (request: {
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
    priority: string;
    isUrgent: boolean;
    emergencyContact: string;
    documents?: File[];
  }) => void;
  availableBalance: Record<string, number>;
}

const EnhancedLeaveRequestForm = ({ onSubmit, availableBalance }: EnhancedLeaveRequestFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    reason: "",
    priority: "NORMAL",
    isUrgent: false,
    emergencyContact: "",
    documents: [] as File[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.type) newErrors.type = "Leave type is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.reason.trim()) newErrors.reason = "Reason is required";
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact is required";
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = "End date must be after start date";
    }

    // Check available balance
    if (formData.type && formData.startDate && formData.endDate) {
      const requestedDays = Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const available = availableBalance[formData.type] || 0;
      
      if (requestedDays > available) {
        newErrors.balance = `Insufficient balance. Available: ${available} days, Requested: ${requestedDays} days`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      type: formData.type,
      startDate: format(formData.startDate!, 'yyyy-MM-dd'),
      endDate: format(formData.endDate!, 'yyyy-MM-dd'),
      reason: formData.reason,
      priority: formData.priority,
      isUrgent: formData.isUrgent,
      emergencyContact: formData.emergencyContact,
      documents: formData.documents
    });

    // Reset form
    setFormData({
      type: "",
      startDate: null,
      endDate: null,
      reason: "",
      priority: "NORMAL",
      isUrgent: false,
      emergencyContact: "",
      documents: []
    });
    setErrors({});

    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been submitted successfully.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, documents: [...prev.documents, ...files] }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      return Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  const leaveTypes = [
    { value: "Sick Leave", label: "Sick Leave", urgent: true },
    { value: "Personal Leave", label: "Personal Leave", urgent: false },
    { value: "Emergency Leave", label: "Emergency Leave", urgent: true },
    { value: "Medical Leave", label: "Medical Leave", urgent: true },
    { value: "Family Leave", label: "Family Leave", urgent: false },
    { value: "Academic Leave", label: "Academic Leave", urgent: false }
  ];

  const priorityOptions = [
    { value: "LOW", label: "Low", color: "bg-gray-100 text-gray-800" },
    { value: "NORMAL", label: "Normal", color: "bg-blue-100 text-blue-800" },
    { value: "HIGH", label: "High", color: "bg-yellow-100 text-yellow-800" },
    { value: "URGENT", label: "Urgent", color: "bg-red-100 text-red-800" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leave Type */}
        <div className="space-y-2">
          <Label htmlFor="leave-type">Leave Type *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
            <SelectTrigger className={errors.type ? "border-red-500" : ""}>
              <SelectValue placeholder="Select leave type" />
            </SelectTrigger>
            <SelectContent>
              {leaveTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{type.label}</span>
                    {availableBalance[type.value] && (
                      <Badge variant="outline" className="ml-2">
                        {availableBalance[type.value]} days
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  <Badge className={priority.color}>
                    {priority.label}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Selection */}
      <div className="space-y-2">
        <Label>Duration *</Label>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground",
                  errors.startDate && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? format(formData.startDate, "PPP") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.startDate || undefined}
                onSelect={(date) => setFormData({...formData, startDate: date || null})}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground",
                  errors.endDate && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? format(formData.endDate, "PPP") : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.endDate || undefined}
                onSelect={(date) => setFormData({...formData, endDate: date || null})}
                disabled={(date) => date < (formData.startDate || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {errors.startDate && <p className="text-sm text-red-600">{errors.startDate}</p>}
        {errors.endDate && <p className="text-sm text-red-600">{errors.endDate}</p>}
        
        {calculateDays() > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Duration: {calculateDays()} day{calculateDays() > 1 ? 's' : ''}</span>
          </div>
        )}
        
        {errors.balance && (
          <div className="flex items-center space-x-2 text-sm text-red-600">
            <AlertTriangle className="w-4 h-4" />
            <span>{errors.balance}</span>
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      <div className="space-y-2">
        <Label htmlFor="emergency-contact">Emergency Contact *</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="emergency-contact"
            type="tel"
            placeholder="Enter emergency contact number"
            value={formData.emergencyContact}
            onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
            className={`pl-10 ${errors.emergencyContact ? "border-red-500" : ""}`}
          />
        </div>
        {errors.emergencyContact && <p className="text-sm text-red-600">{errors.emergencyContact}</p>}
      </div>

      {/* Reason */}
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Leave *</Label>
        <Textarea
          id="reason"
          placeholder="Please provide a detailed reason for your leave request..."
          value={formData.reason}
          onChange={(e) => setFormData({...formData, reason: e.target.value})}
          rows={4}
          className={errors.reason ? "border-red-500" : ""}
        />
        {errors.reason && <p className="text-sm text-red-600">{errors.reason}</p>}
      </div>

      {/* Document Upload */}
      <div className="space-y-2">
        <Label htmlFor="documents">Supporting Documents</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Click to upload documents
                </span>
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                PDF, DOC, DOCX, JPG, PNG up to 10MB each
              </p>
            </div>
          </div>
        </div>
        
        {formData.documents.length > 0 && (
          <div className="space-y-2">
            {formData.documents.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm truncate">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Urgent Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="urgent"
          checked={formData.isUrgent}
          onCheckedChange={(checked) => setFormData({...formData, isUrgent: checked as boolean})}
        />
        <Label htmlFor="urgent" className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span>Mark as urgent (requires immediate attention)</span>
        </Label>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={!formData.type || !formData.startDate || !formData.endDate || !formData.reason || !formData.emergencyContact}
      >
        Submit Leave Request
      </Button>
    </form>
  );
};

export default EnhancedLeaveRequestForm;
