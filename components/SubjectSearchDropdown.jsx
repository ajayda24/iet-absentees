"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRecentSubjects } from "@/hooks/useRecentSubjects";
import { X } from "lucide-react";
import { toTitleCase } from "@/utils/general";

// Utility function to convert text to title case


export default function SubjectSearchDropdown({ value, onChange, nextStep }) {
  const { recentSubjects } = useRecentSubjects();
  const { addRecentSubject } = useRecentSubjects();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(toTitleCase(value) || "");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const dropdownRef = useRef(null);
  const isClickingDropdownRef = useRef(false);

  // Filter recent subjects based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSubjects(recentSubjects.map((s) => toTitleCase(s)));
    } else {
      const filtered = recentSubjects.filter((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSubjects(filtered.map((s) => toTitleCase(s)));
    }
  }, [searchTerm, recentSubjects]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSubject = (subject) => {
    const titleCasedSubject = toTitleCase(subject);
    const lowercaseSubject = subject.toLowerCase();
    onChange(lowercaseSubject);
    setSearchTerm(titleCasedSubject);
    addRecentSubject(lowercaseSubject);
    setIsOpen(false);
    isClickingDropdownRef.current = false;
  };

  const handleBlur = () => {
    // Prevent blur if we're in the middle of selecting from dropdown
    if (isClickingDropdownRef.current) {
      isClickingDropdownRef.current = false;
      return;
    }

    // Auto-save subject when field loses focus if it's not empty
    if (searchTerm.trim() !== "") {
      const lowercaseSubject = searchTerm.toLowerCase();
      addRecentSubject(lowercaseSubject);
      onChange(lowercaseSubject);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    onChange("");
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (searchTerm.trim() !== "") {
        const lowercaseSubject = searchTerm.toLowerCase();
        addRecentSubject(lowercaseSubject);
        onChange(lowercaseSubject);
        nextStep();
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Label htmlFor="subject" className="text-sm">
        Subject
        {/* <span className="text-xs text-muted-foreground">(Optional)</span> */}
      </Label>
      <div className="flex gap-2 mt-2">
        <div className="relative flex-1">
          <Input
            id="subject"
            type="text"
            placeholder="e.g., DSA, Java"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={handleBlur}
            className="text-sm"
            autoComplete="off"
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Dropdown menu */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
              {recentSubjects.length > 0 && searchTerm.trim() === "" && (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  Recent subjects
                </div>
              )}

              {filteredSubjects.length > 0 && (
                filteredSubjects.map((subject, idx) => (
                  <button
                    key={idx}
                    onMouseDown={() => {
                      isClickingDropdownRef.current = true;
                    }}
                    onClick={() => handleSelectSubject(subject)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  >
                    {toTitleCase(subject)}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
