"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRecentSubjects } from "@/hooks/useRecentSubjects";
import { X, Plus } from "lucide-react";

export default function SubjectSearchDropdown({ value, onChange }) {
  const { recentSubjects } = useRecentSubjects();
  const { addRecentSubject } = useRecentSubjects();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const dropdownRef = useRef(null);

  // Filter recent subjects based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSubjects(recentSubjects);
    } else {
      const filtered = recentSubjects.filter((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSubjects(filtered);
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
    onChange(subject);
    setSearchTerm(subject);
    setIsOpen(false);
  };

  const handleAddNewSubject = () => {
    if (searchTerm.trim() !== "") {
      addRecentSubject(searchTerm);
      onChange(searchTerm);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    onChange("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Label htmlFor="subject" className="text-sm">
        Subject <span className="text-xs text-muted-foreground">(Optional)</span>
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
            className="text-sm"
            autocomplete="off"
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

              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSubject(subject)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  >
                    {subject}
                  </button>
                ))
              ) : recentSubjects.length === 0 && searchTerm.trim() !== "" ? (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  No matches found
                </div>
              ) : null}

              {/* Add new subject option */}
              {searchTerm.trim() !== "" &&
                !filteredSubjects.includes(searchTerm.trim()) && (
                  <button
                    onClick={handleAddNewSubject}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm border-t flex items-center gap-2 text-blue-600"
                  >
                    <Plus className="h-3 w-3" />
                    Add "{searchTerm}"
                  </button>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
