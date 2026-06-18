import { useState, useEffect } from "react";

export function useRecentSubjects() {
  const [recentSubjects, setRecentSubjects] = useState([]);

  // Load recent subjects from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentSubjects");
      if (stored) {
        setRecentSubjects(JSON.parse(stored));
      }
    } catch (error) {
      console.error("[v0] Error loading recent subjects:", error);
    }
  }, []);

  // Add a subject to recent subjects
  const addRecentSubject = (subject) => {
    if (!subject || subject.trim() === "") return;

    const trimmed = subject.trim();
    const updated = [
      trimmed,
      ...recentSubjects.filter((s) => s.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, 10); // Keep only 10 most recent

    setRecentSubjects(updated);
    try {
      localStorage.setItem("recentSubjects", JSON.stringify(updated));
    } catch (error) {
      console.error("[v0] Error saving recent subjects:", error);
    }
  };

  // Get all recent subjects
  const getRecentSubjects = () => recentSubjects;

  // Clear all recent subjects
  const clearRecentSubjects = () => {
    setRecentSubjects([]);
    try {
      localStorage.removeItem("recentSubjects");
    } catch (error) {
      console.error("[v0] Error clearing recent subjects:", error);
    }
  };

  return {
    recentSubjects,
    addRecentSubject,
    getRecentSubjects,
    clearRecentSubjects,
  };
}
