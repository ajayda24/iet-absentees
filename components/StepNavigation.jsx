"use client";

import { useStep } from "@/context/StepContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STEP_LABELS = [
  "Welcome",
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
    (currentStep === 1 && selectedSemester) ||
    (currentStep === 2 && selectedDepartment) ||
    (currentStep === 3) || // Hour is optional
    (currentStep === 4 && totalStudents) ||
    currentStep === 5 ||
    currentStep === 6;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-3 md:p-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-3 md:gap-4">
        {/* Step Indicators - Hidden on mobile, shown on tablet+ */}
        <div className="hidden sm:flex justify-center gap-1 md:gap-2">
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
                className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
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
                  className={`w-1 h-0.5 mx-0.5 md:mx-1 transition-colors ${
                    index < currentStep ? "bg-green-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2 md:gap-3 justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex-1 text-xs md:text-sm py-2 md:py-2"
            size="sm"
          >
            <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
            <span className="hidden md:inline">Previous</span>
          </Button>

          <div className="text-center text-xs text-muted-foreground flex items-center px-2 md:px-4 whitespace-nowrap">
            {currentStep + 1} / {STEP_LABELS.length}
          </div>

          <Button
            onClick={nextStep}
            disabled={!canGoNext || currentStep === 6}
            className="flex-1 text-xs md:text-sm py-2 md:py-2"
            size="sm"
          >
            <span className="hidden md:inline">{currentStep === 6 ? "Done" : "Next"}</span>
            <span className="md:hidden">{currentStep === 6 ? "✓" : "→"}</span>
            {currentStep !== 6 && <ChevronRight className="h-3 w-3 md:h-4 md:w-4 md:ml-2 hidden md:inline" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
