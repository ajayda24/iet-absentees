"use client";

import { StepProvider, useStep } from "@/context/StepContext";
import StepContainer from "@/components/StepContainer";
import StepNavigation from "@/components/StepNavigation";

import StepSemester from "@/components/steps/StepSemester";
import StepDepartment from "@/components/steps/StepDepartment";
import StepHour from "@/components/steps/StepHour";
import StepStudentCount from "@/components/steps/StepStudentCount";
import StepMarkAttendance from "@/components/steps/StepMarkAttendance";
import StepSummary from "@/components/steps/StepSummary";

const STEPS = [
  StepSemester,
  StepDepartment,
  StepHour,
  StepStudentCount,
  StepMarkAttendance,
  StepSummary,
];

function StepContent() {
  const { currentStep } = useStep();
  const CurrentStep = STEPS[currentStep];

  return (
    <>
      <div className="pb-32">
        <StepContainer>
          <CurrentStep />
        </StepContainer>
      </div>
      <StepNavigation />
    </>
  );
}

export default function Home() {
  return (
    <StepProvider>
      <StepContent />
    </StepProvider>
  );
}
