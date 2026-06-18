"use client";

import { useStep } from "@/context/StepContext";
import RadioCardGroup from "@/components/RadioCardGroup";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StepHour() {
  const { selectedHour, setSelectedHour, nextStep } = useStep();

  const hoursArray = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
  const hourOptions = hoursArray.map((h) => ({
    label: h,
    value: h,
  }));

  const handleSkip = () => {
    setSelectedHour("");
    nextStep();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-sm w-full flex flex-col gap-8">
        {/* Header with Icon */}
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-purple-100 rounded-full">
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Select Hour</h2>
            <p className="text-sm text-muted-foreground">
              Choose the hour (optional - you can skip)
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <RadioCardGroup
            title=""
            options={hourOptions}
            value={selectedHour}
            onChange={setSelectedHour}
          />
        </div>

        {/* Skip Button */}
        <Button
          variant="outline"
          onClick={handleSkip}
          className="w-full"
        >
          Skip (Optional)
        </Button>
      </div>
    </div>
  );
}
