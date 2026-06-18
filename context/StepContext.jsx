"use client";

import { createContext, useContext, useState } from "react";

const StepContext = createContext();

export function StepProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [totalStudents, setTotalStudents] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [subject, setSubject] = useState("");
  const [absentees, setAbsentees] = useState([]);
  const [markAllPresentClicked, setMarkAllPresentClicked] = useState(false);

  const toggleStatus = (id) => {
    setAbsentees((prev) => {
      const newAbsentees = prev.includes(id)
        ? prev.filter((absentId) => absentId !== id)
        : [...prev, id];
      return newAbsentees.sort((a, b) => a - b);
    });
  };

  const markAllPresent = () => {
    setAbsentees([]);
    setMarkAllPresentClicked(true);
  };

  const markAllAbsent = () => {
    const studentsArray = Array.from({ length: totalStudents }, (_, i) => i + 1);
    setAbsentees(studentsArray);
  };

  const resetForm = () => {
    setCurrentStep(0);
    setTotalStudents("");
    setSelectedSemester("");
    setSelectedDepartment("");
    setSelectedHour("");
    setSubject("");
    setAbsentees([]);
    setMarkAllPresentClicked(false);
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (step) => {
    setCurrentStep(Math.max(0, Math.min(step, 6)));
  };

  return (
    <StepContext.Provider
      value={{
        currentStep,
        goToStep,
        nextStep,
        prevStep,
        totalStudents,
        setTotalStudents,
        selectedSemester,
        setSelectedSemester,
        selectedDepartment,
        setSelectedDepartment,
        selectedHour,
        setSelectedHour,
        subject,
        setSubject,
        absentees,
        setAbsentees,
        toggleStatus,
        markAllPresent,
        markAllAbsent,
        markAllPresentClicked,
        setMarkAllPresentClicked,
        resetForm,
      }}
    >
      {children}
    </StepContext.Provider>
  );
}

export function useStep() {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error("useStep must be used within StepProvider");
  }
  return context;
}
