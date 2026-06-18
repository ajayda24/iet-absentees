"use client";

import { useStep } from "@/context/StepContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Github, Linkedin, Zap, BarChart3, Cloud } from "lucide-react";

export default function StepWelcome() {
  const { nextStep } = useStep();

  const features = [
    { icon: Zap, label: "Fast & Simple" },
    { icon: BarChart3, label: "Smart Tracking" },
    { icon: Cloud, label: "Works Offline" },
  ];

  return (
    <div className="flex flex-col items-center justify-center pt-16 pb-24 p-4">
      <div className="max-w-sm w-full flex flex-col gap-10">
        {/* Icon & Heading */}
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <CheckCircle2 className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Easy Attendance</h1>
            <p className="text-sm text-muted-foreground">
              Mark attendance, track records, work offline
            </p>
          </div>
        </div>

        {/* Modern Feature Cards */}
        <div className="grid grid-cols-3 gap-3">
          {features.map(({ icon: Icon, label }, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Icon className="h-5 w-5 text-blue-600" />
              <p className="text-xs font-medium text-center">{label}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={nextStep}
          className="w-full py-6 text-base font-medium"
        >
          Get Started
        </Button>

        {/* Developer Info */}
        <div className="text-center border-t pt-6">
          <p className="text-xs text-muted-foreground mb-2">Built by</p>
          <p className="text-sm font-semibold mb-3">Developer Name</p>
          <div className="flex gap-3 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5 text-gray-600" />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5 text-blue-600" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
