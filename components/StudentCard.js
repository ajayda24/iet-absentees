"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, UserCheck, UserX } from "lucide-react";

export default function StudentCard({
  studentId,
  status,
  toggleStatus,
  selectedDepartment,
  selectedSemester,
}) {

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <UserCheck className="h-5 w-5 text-green-600" />;
      case "absent":
        return <UserX className="h-5 w-5 text-red-600" />;
      default:
        return <User className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "border-green-200 bg-green-50";
      case "absent":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  return (
    <Card
      className={`transition-all duration-200 ${getStatusColor(status)}`}
      onClick={() => toggleStatus(studentId)}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-lg ">{studentId}</p>
          {getStatusIcon(status)}
        </div>

        <div className="text-xs text-gray-500 mb-3">
          {selectedSemester} • {selectedDepartment}
        </div>
      </CardContent>
    </Card>
  );
}
