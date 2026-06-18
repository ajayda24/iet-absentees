"use client";

import { useStep } from "@/context/StepContext";
import RadioCardGroup from "@/components/RadioCardGroup";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StepHour() {
  const { selectedHour, setSelectedHour, subject, setSubject, nextStep } = useStep();

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
            <Label htmlFor="subject" className="text-sm">
              Subject <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="subject"
              type="text"
              placeholder="e.g., Mathematics, Physics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="text-sm"
            />
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
