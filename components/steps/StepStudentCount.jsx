"use client";

import { useStep } from "@/context/StepContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

export default function StepStudentCount() {
  const { totalStudents, setTotalStudents } = useStep();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-sm w-full flex flex-col gap-8">
        {/* Header with Icon */}
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-green-100 rounded-full">
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Total Students</h2>
            <p className="text-sm text-muted-foreground">
              Enter the total number of students
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="grid gap-3">
            <Label htmlFor="students" className="text-base">
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
              className="text-center text-lg py-6"
            />
            <p className="text-xs text-muted-foreground mt-2">
              This will generate individual student cards for marking attendance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
