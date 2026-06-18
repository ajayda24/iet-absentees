"use client";

import { useEffect, useRef } from "react";
import { useStep } from "@/context/StepContext";
import RadioCardGroup from "@/components/RadioCardGroup";
import { Building2 } from "lucide-react";

export default function StepDepartment() {
  const { selectedDepartment, setSelectedDepartment, currentStep, nextStep } = useStep();
  const autoNavigateTriggeredRef = useRef(false);
  const previousStepRef = useRef(currentStep);

  const departmentsArray = ["IT", "CSE", "EC", "EEE", "ME", "EP", "PT"];
  const departmentOptions = departmentsArray.map((d) => ({
    label: d,
    value: d,
  }));

  // Reset flag when returning to this step
  useEffect(() => {
    // Only reset if we're coming back to this step (not leaving it)
    if (currentStep === 2 && previousStepRef.current !== 2) {
      autoNavigateTriggeredRef.current = false;
    }
    previousStepRef.current = currentStep;
  }, [currentStep]);

  // Auto-navigate after selecting department (only if on this step)
  useEffect(() => {
    if (selectedDepartment && !autoNavigateTriggeredRef.current && currentStep === 2) {
      const timer = setTimeout(() => {
        autoNavigateTriggeredRef.current = true;
        nextStep();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedDepartment, nextStep, currentStep]);

  return (
    <div className="flex flex-col items-center justify-center pt-12 pb-24 p-4">
      <div className="max-w-sm w-full flex flex-col gap-6">
        {/* Header with Icon */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-amber-100 rounded-full">
            <Building2 className="h-6 w-6 text-amber-600" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-1">Select Department</h2>
            <p className="text-xs text-muted-foreground">
              Choose the department for attendance
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
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
