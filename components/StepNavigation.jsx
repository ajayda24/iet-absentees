"use client";

import { useStep } from "@/context/StepContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STEP_LABELS = [
  "Semester",
  "Department",
  "Hour",
  "Count",
  "Attendance",
  "Summary",
];

export default function StepNavigation() {
  const {
    currentStep,
    nextStep,
    prevStep,
    selectedSemester,
    selectedDepartment,
    totalStudents,
  } = useStep();

  const canGoNext =
    (currentStep === 0 && selectedSemester) ||
    (currentStep === 1 && selectedDepartment) ||
    (currentStep === 2) || // Hour is optional
    (currentStep === 3 && totalStudents) ||
    currentStep === 4 ||
    currentStep === 5;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* Step Indicators */}
        <div className="flex justify-center gap-2">
          {STEP_LABELS.map((label, index) => (
            <div key={index} className="flex items-center">
              <button
                onClick={() => {
                  // Allow navigation to previous steps or current step
                  if (index <= currentStep) {
                    // Only allow going back to steps we've already completed
                  }
                }}
                disabled={index > currentStep + 1}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  index === currentStep
                    ? "bg-blue-600 text-white"
                    : index < currentStep
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-400"
                }`}
                title={label}
              >
                {index + 1}
              </button>
              {index < STEP_LABELS.length - 1 && (
                <div
                  className={`w-2 h-0.5 mx-1 transition-colors ${
                    index < currentStep ? "bg-green-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex-1"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-center text-sm text-muted-foreground flex items-center px-4">
            {currentStep + 1} / {STEP_LABELS.length}
          </div>

          <Button
            onClick={nextStep}
            disabled={!canGoNext || currentStep === 5}
            className="flex-1"
          >
            {currentStep === 5 ? "Done" : "Next"}
            {currentStep !== 5 && <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
