"use client";

import { useEffect } from "react";
import { useStep } from "@/context/StepContext";
import RadioCardGroup from "@/components/RadioCardGroup";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SubjectSearchDropdown from "@/components/SubjectSearchDropdown";
import { useRecentSubjects } from "@/hooks/useRecentSubjects";
import { useAttendanceStorage } from "@/hooks/useAttendanceStorage";

export default function StepHour() {
  const { selectedHour, setSelectedHour, subject, setSubject, selectedSemester, selectedDepartment, setTotalStudents, goToStep, nextStep } = useStep();
  const { addRecentSubject } = useRecentSubjects();
  const { getTotalStudentsForClass } = useAttendanceStorage();

  const hoursArray = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
  const hourOptions = hoursArray.map((h) => ({
    label: h,
    value: h,
  }));

  const handleSubjectChange = (newSubject) => {
    setSubject(newSubject);
    if (newSubject.trim() !== "") {
      addRecentSubject(newSubject);
    }
  };

  // Check if total students is saved for this class and navigate accordingly
  useEffect(() => {
    if (selectedHour && selectedSemester && selectedDepartment) {
      const savedStudentCount = getTotalStudentsForClass(selectedSemester, selectedDepartment);
      if (savedStudentCount) {
        // Total students already saved, skip to Mark Attendance (step 6)
        setTotalStudents(savedStudentCount);
        const timer = setTimeout(() => {
          goToStep(5);
        }, 300);
        return () => clearTimeout(timer);
      } else {
        // No saved student count, go to Student Count step (step 5)
        nextStep();
      }
    }
  }, [selectedHour, selectedSemester, selectedDepartment, getTotalStudentsForClass, setTotalStudents, nextStep, goToStep]);

  const handleSkip = () => {
    setSelectedHour("");
    nextStep();
  };

  return (
    <div className="flex flex-col items-center justify-center pt-12 pb-24 p-4">
      <div className="max-w-sm w-full flex flex-col gap-5">
        {/* Header with Icon */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-full">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-1">Select Hour</h2>
            <p className="text-xs text-muted-foreground">
              Choose the hour (optional - you can skip)
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-4 shadow-sm border space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Hour</p>
            <RadioCardGroup
              title=""
              options={hourOptions}
              value={selectedHour}
              onChange={setSelectedHour}
            />
          </div>

          {/* Subject Field */}
          <div className="space-y-2 pt-2">
            <SubjectSearchDropdown value={subject} onChange={handleSubjectChange} />
          </div>
        </div>

        {/* Skip Button */}
        <Button
          variant="outline"
          onClick={handleSkip}
          className="w-full"
          size="sm"
        >
          Skip (Optional)
        </Button>
      </div>
    </div>
  );
}
