"use client";

import { useEffect, useRef } from "react";
import { useStep } from "@/context/StepContext";
import RadioCardGroup from "@/components/RadioCardGroup";
import { Calendar } from "lucide-react";

export default function StepSemester() {
  const { selectedSemester, setSelectedSemester, currentStep, nextStep } = useStep();
  const autoNavigateTriggeredRef = useRef(false);
  const previousStepRef = useRef(currentStep);

  const semestersArray = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
  const semesterOptions = semestersArray.map((s) => ({
    label: s,
    value: s,
  }));

 const prevSemesterRef = useRef(null);

useEffect(() => {
  if (
    selectedSemester &&
    selectedSemester !== prevSemesterRef.current
  ) {
    prevSemesterRef.current = selectedSemester;
    nextStep();
  }
}, [selectedSemester, nextStep]);

  // // Reset flag when returning to this step
  // useEffect(() => {
  //   // Only reset if we're coming back to this step (not leaving it)
  //   if (currentStep === 1 && previousStepRef.current !== 1) {
  //     autoNavigateTriggeredRef.current = false;
  //   }
  //   previousStepRef.current = currentStep;
  // }, [currentStep]);

  // // Auto-navigate after selecting semester (only if on this step)
  // useEffect(() => {
  //   if (selectedSemester && !autoNavigateTriggeredRef.current && currentStep === 1) {
  //     const timer = setTimeout(() => {
  //       autoNavigateTriggeredRef.current = true;
  //       nextStep();
  //     }, 300);
  //     return () => clearTimeout(timer);
  //   }
  // }, [selectedSemester, nextStep, currentStep]);

  return (
    <div className="flex flex-col items-center justify-center pt-12 pb-24 p-4">
      <div className="max-w-sm w-full flex flex-col gap-6">
        {/* Header with Icon */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-full">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-1">Select Semester</h2>
            <p className="text-xs text-muted-foreground">
              Choose the semester for attendance
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
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
