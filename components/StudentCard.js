"use client";

import { Card } from "@/components/ui/card";
import { UserCheck, UserX } from "lucide-react";

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
      // default:
      //   return <User className="h-5 w-5 text-gray-400" />;
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
      className={`transition-all duration-150 p-3 max-w-24 w-full flex justify-center items-center ${getStatusColor(status)}`}
      onClick={() => toggleStatus(studentId)}
    >
      {/* <div className="p-3 w-full"> */}
        <div className="flex items-center gap-2">
          <p className="text-lg ">{studentId}</p>
          {getStatusIcon(status)}
        </div>

        {/* <div className="text-xs text-center text-gray-500">
          {selectedSemester} • {selectedDepartment}
        </div> */}
      {/* </div> */}
    </Card>
  );
}
