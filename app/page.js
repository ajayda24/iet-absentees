"use client";

import { StepProvider, useStep } from "@/context/StepContext";
import StepContainer from "@/components/StepContainer";
import StepNavigation from "@/components/StepNavigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

import StepWelcome from "@/components/steps/StepWelcome";
import StepSemester from "@/components/steps/StepSemester";
import StepDepartment from "@/components/steps/StepDepartment";
import StepHour from "@/components/steps/StepHour";
import StepStudentCount from "@/components/steps/StepStudentCount";
import StepMarkAttendance from "@/components/steps/StepMarkAttendance";
import StepSummary from "@/components/steps/StepSummary";

const STEPS = [
  StepWelcome,
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
      <div className={`${currentStep>0?'pb-32':''}`}>
        <StepContainer>
          <CurrentStep />
        </StepContainer>
      </div>
      {currentStep === 0 && (
        <div className="fixed top-4 right-4 z-50">
          <Link href="/reports">
            <Button variant="outline" size="sm" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              View Reports
            </Button>
          </Link>
        </div>
      )}
      {currentStep > 0 && <StepNavigation />}
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
