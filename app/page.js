"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [totalStudents, setTotalStudents] = useState(57);
  const [absentees, setAbsentees] = useState([]);

  const findAbsentee = (index) => absentees.find((value) => value == index);

  const studentsArray = Array.from({ length: totalStudents }, (_, i) => i + 1);

  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, "0"); // Add leading zero if needed
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const year = currentDate.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  const copyText = () => {
    const textToCopy = `Today's Absentees\nDate: ${formattedDate}\nAbsentees: ${absentees.join(
      ", "
    )}`;
    navigator.clipboard.writeText(textToCopy);
  };
  return (
    <div className="flex flex-col items-center p-4 py-6">
      <div className="max-w-sm w-full">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="totalStudents">Total Students</Label>
          <Input
            type="number"
            onChange={(e) => setTotalStudents(e.target.value)}
            value={totalStudents}
            id="totalStudents"
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 my-10 max-w-xl">
        {studentsArray.map((student) => (
          <div
            key={student}
            className={`w-16 h-16 border border-black flex items-center justify-center ${
              findAbsentee(student)
                ? "bg-red-500 text-white"
                : "bg-white text-black"
            }`}
            onClick={() =>
              setAbsentees(
                (prevState) =>
                  prevState.includes(student)
                    ? prevState.filter((name) => name !== student) // Remove if exists
                    : [...prevState, student] // Add if not exists
              )
            }
          >
            {student}
          </div>
        ))}
      </div>

      {absentees.length > 0 && (
        <div className="max-w-sm w-full flex flex-col gap-2">
          <h2>{`Today's Absentees`}</h2>
          <h3>Date : {formattedDate}</h3>
          <h3>Absentees : {absentees.join(", ")}</h3>
          <Button onClick={copyText}>Copy text</Button>
        </div>
      )}
    </div>
  );
}
