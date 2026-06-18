"use client";

import { useStep } from "@/context/StepContext";
import StudentCard from "@/components/StudentCard";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";

export default function StepMarkAttendance() {
  const {
    totalStudents,
    absentees,
    toggleStatus,
    markAllPresent,
    markAllAbsent,
    selectedSemester,
    selectedDepartment,
  } = useStep();

  const studentsArray = Array.from({ length: totalStudents }, (_, i) => ({
    id: i + 1,
    status: absentees.includes(i + 1) ? "absent" : "present",
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl w-full flex flex-col gap-6">
        {/* Header with Icon */}
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-red-100 rounded-full">
            <Clipboard className="h-8 w-8 text-red-600" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Mark Attendance</h2>
            <p className="text-sm text-muted-foreground">
              {selectedSemester} - {selectedDepartment} | Total: {totalStudents} students
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            onClick={markAllPresent}
            size="sm"
          >
            Mark All Present
          </Button>
          <Button
            variant="outline"
            onClick={markAllAbsent}
            size="sm"
          >
            Mark All Absent
          </Button>
        </div>

        {/* Students Grid */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex flex-wrap gap-3 justify-center">
            {studentsArray.map((student) => (
              <StudentCard
                key={student.id}
                studentId={student.id}
                status={student.status}
                toggleStatus={toggleStatus}
                selectedDepartment={selectedDepartment}
                selectedSemester={selectedSemester}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Click on a student card to toggle between present (green) and absent (red)
          </p>
        </div>

        {/* Absent Count */}
        {absentees.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-900">
              Absentees ({absentees.length}): {absentees.join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
