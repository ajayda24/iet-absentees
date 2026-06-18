"use client";

import { useStep } from "@/context/StepContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Github, Linkedin } from "lucide-react";

export default function StepWelcome() {
  const { nextStep } = useStep();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md w-full flex flex-col gap-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 bg-blue-100 rounded-full">
            <CheckCircle2 className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-4 text-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Easy Attendance Marker
            </h1>
            <p className="text-sm text-muted-foreground">
              Simple, fast, and intuitive way to mark student attendance in just a few steps
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 py-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
              <span className="text-sm text-foreground">Select semester and department</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
              <span className="text-sm text-foreground">Enter total number of students</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
              <span className="text-sm text-foreground">Mark attendance with one tap</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
              <span className="text-sm text-foreground">View and export summary</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={nextStep}
            size="lg"
            className="w-full mt-4 bg-slate-900 hover:bg-slate-950 text-white"
          >
            Mark Attendance
          </Button>
        </div>

        {/* Developer Info */}
        <div className="border-t pt-6 flex flex-col gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-3">Built by</p>
            <p className="text-sm font-semibold text-foreground">
              Developer Name
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"
              title="GitHub"
            >
              <Github className="h-5 w-5 text-slate-700" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="h-5 w-5 text-slate-700" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
