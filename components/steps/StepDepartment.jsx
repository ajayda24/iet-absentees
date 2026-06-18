"use client";

import { useStep } from "@/context/StepContext";
import RadioCardGroup from "@/components/RadioCardGroup";
import { Building2 } from "lucide-react";

export default function StepDepartment() {
  const { selectedDepartment, setSelectedDepartment } = useStep();

  const departmentsArray = ["IT", "CSE", "EC", "EEE", "ME", "EP", "PT"];
  const departmentOptions = departmentsArray.map((d) => ({
    label: d,
    value: d,
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-sm w-full flex flex-col gap-8">
        {/* Header with Icon */}
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-amber-100 rounded-full">
            <Building2 className="h-8 w-8 text-amber-600" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Select Department</h2>
            <p className="text-sm text-muted-foreground">
              Choose the department for attendance
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <RadioCardGroup
            title=""
            options={departmentOptions}
            value={selectedDepartment}
            onChange={setSelectedDepartment}
          />
        </div>
      </div>
    </div>
  );
}
