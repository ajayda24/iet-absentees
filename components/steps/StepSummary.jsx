"use client";

import { useStep } from "@/context/StepContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Copy, Save } from "lucide-react";
import { toast } from "sonner";
import { useAttendanceStorage } from "@/hooks/useAttendanceStorage";

export default function StepSummary() {
  const {
    selectedSemester,
    selectedDepartment,
    selectedHour,
    subject,
    totalStudents,
    absentees,
    resetForm,
  } = useStep();

  const { saveAttendanceRecord } = useAttendanceStorage();

  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const copyText = () => {
    const textToCopy = `Today's Absentees
Date: ${formattedDate}
${selectedSemester} - ${selectedDepartment}
${selectedHour ? `${selectedHour} Hour` : "Hour: Not specified"}
Absentees: ${absentees.length > 0 ? absentees.join(", ") : "None"}`;

    navigator.clipboard.writeText(textToCopy);
    toast.success("Copied to clipboard", {
      position: "top-right",
      duration: 2000,
    });
  };

  const copyRollNoOnly = () => {
    const textToCopy = absentees.length > 0 ? absentees.join(", ") : "None";
    navigator.clipboard.writeText(textToCopy);
    toast.success("Copied Roll No. only.", {
      position: "top-right",
      duration: 2000,
    });
  };

  const handleSaveAttendance = () => {
    const result = saveAttendanceRecord({
      semester: selectedSemester,
      department: selectedDepartment,
      hour: selectedHour,
      subject,
      totalStudents: parseInt(totalStudents),
      absentees,
    });

    if (result.success) {
      toast.success(result.message, {
        position: "top-right",
        duration: 2000,
      });
    } else {
      toast.error(result.message, {
        position: "top-right",
        duration: 2000,
      });
    }
  };

  const presentCount = totalStudents - absentees.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-sm w-full flex flex-col gap-6">
        {/* Header with Icon */}
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-emerald-100 rounded-full">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Summary</h2>
            <p className="text-sm text-muted-foreground">
              Review and copy your attendance report
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="space-y-3">
          {/* Date and Details */}
          <Card className="p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Semester:</span>
                <span className="font-medium">{selectedSemester}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium">{selectedDepartment}</span>
              </div>
              {selectedHour && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hour:</span>
                  <span className="font-medium">{selectedHour} Hour</span>
                </div>
              )}
              {subject && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="font-medium">{subject}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Attendance Stats */}
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700 font-medium">Total Students:</span>
                <span className="font-bold text-lg text-green-700">{totalStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700 font-medium">Present:</span>
                <span className="font-bold text-green-700">{presentCount}</span>
              </div>
            </div>
          </Card>

          {/* Absent Info */}
          <Card
            className={`p-4 ${
              absentees.length > 0
                ? "bg-red-50 border-red-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span
                  className={`font-medium ${
                    absentees.length > 0 ? "text-red-700" : "text-blue-700"
                  }`}
                >
                  Absent:
                </span>
                <span
                  className={`font-bold text-lg ${
                    absentees.length > 0 ? "text-red-700" : "text-blue-700"
                  }`}
                >
                  {absentees.length}
                </span>
              </div>
              {absentees.length > 0 && (
                <div className="text-red-700 text-xs break-words pt-2 border-t border-red-200">
                  {absentees.join(", ")}
                </div>
              )}
              {absentees.length === 0 && (
                <div className="text-blue-700 text-xs">
                  All students are marked present!
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Save Attendance Button */}
        <Button onClick={handleSaveAttendance} className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save Attendance Record
        </Button>

        {/* Copy Buttons */}
        <div className="flex flex-col gap-2">
          <Button onClick={copyText} className="w-full" size="lg">
            <Copy className="h-4 w-4 mr-2" />
            Copy Full Report
          </Button>
          {absentees.length > 0 && (
            <Button onClick={copyRollNoOnly} variant="outline" className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copy Roll Numbers Only
            </Button>
          )}
        </div>

        {/* Reset Button */}
        <Button onClick={resetForm} variant="outline" className="w-full">
          Start New Report
        </Button>
      </div>
    </div>
  );
}
