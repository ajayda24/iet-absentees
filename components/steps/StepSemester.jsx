"use client";

import { useStep } from "@/context/StepContext";
import RadioCardGroup from "@/components/RadioCardGroup";
import { Calendar } from "lucide-react";

export default function StepSemester() {
  const { selectedSemester, setSelectedSemester } = useStep();

  const semestersArray = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
  const semesterOptions = semestersArray.map((s) => ({
    label: s,
    value: s,
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-sm w-full flex flex-col gap-8">
        {/* Header with Icon */}
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-blue-100 rounded-full">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Select Semester</h2>
            <p className="text-sm text-muted-foreground">
              Choose the semester for attendance
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <RadioCardGroup
            title=""
            options={semesterOptions}
            value={selectedSemester}
            onChange={setSelectedSemester}
          />
        </div>
      </div>
    </div>
  );
}
