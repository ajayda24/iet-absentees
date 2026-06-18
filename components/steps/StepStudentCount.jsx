"use client";

import { useStep } from "@/context/StepContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

export default function StepStudentCount() {
  const { totalStudents, setTotalStudents } = useStep();

  return (
    <div className="flex flex-col items-center justify-center pt-12 pb-24 p-4">
      <div className="max-w-sm w-full flex flex-col gap-6">
        {/* Header with Icon */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-green-100 rounded-full">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-1">Total Students</h2>
            <p className="text-xs text-muted-foreground">
              Enter the total number of students
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="grid gap-2">
            <Label htmlFor="students" className="text-sm">
              Number of Students
            </Label>
            <Input
              id="students"
              type="number"
              min="1"
              max="100"
              value={totalStudents}
              onChange={(e) => setTotalStudents(e.target.value)}
              placeholder="Enter number"
              className="text-center py-4"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This will generate individual student cards for marking attendance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
