"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import StudentCard from "@/components/StudentCard";

export default function Home() {
  const [totalStudents, setTotalStudents] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [absentees, setAbsentees] = useState([]);

  const studentsArray = Array.from({ length: totalStudents }, (_, i) => ({
    id: i + 1,
    status: "present",
  }));
  const departmentsArray = ["IT", "CSE", "EC", "EEE", "ME", "EP", "PT"];
  const semestersArray = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, "0"); 
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  const copyText = () => {
    const textToCopy = `Today's Absentees \nDate: ${formattedDate} \n${selectedSemester} - ${selectedDepartment} \nAbsentees: ${absentees.join(
      ", "
    )}`;
    navigator.clipboard.writeText(textToCopy);
  };

  const toggleStatus = (id) => {
    setAbsentees((prev) => {
      const newAbsentees = prev.includes(id)
        ? prev.filter((absentId) => absentId !== id)
        : [...prev, id]; 

      return newAbsentees.sort((a, b) => a - b)
    });
  };
  return (
    <div className="flex flex-col items-center p-4 py-6">
      <div className="max-w-sm w-full flex flex-col gap-3">
        <h1 className='text-center font-thin text-xxl'>IET Absentees</h1>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="department">Select Semester</Label>
          <Select
            value={selectedSemester}
            onValueChange={(value) => setSelectedSemester(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              {semestersArray.map((semester) => (
                <SelectItem key={semester} value={semester}>
                  {semester}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="department">Select Department</Label>
          <Select
            value={selectedDepartment}
            onValueChange={(value) => setSelectedDepartment(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departmentsArray.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
        {selectedDepartment && selectedSemester && studentsArray.map((student) => {
          const isAbsent = absentees.includes(student.id);
          return (
            <StudentCard
              key={student.id}
              studentId={student.id}
              status={isAbsent ? "absent" : "present"}
              toggleStatus={toggleStatus}
              selectedDepartment={selectedDepartment}
              selectedSemester={selectedSemester}
            />
          );
        })}
      </div>

      {absentees.length > 0 && (
        <div className="max-w-sm w-full flex flex-col gap-2">
          <h2>{`Today's Absentees`}</h2>
          <h3>Date : {formattedDate}</h3>
          <h3>
            {selectedSemester} - {selectedDepartment}
          </h3>
          <h3>Absentees : {absentees.join(", ")}</h3>
          <Button onClick={copyText}>Copy text</Button>
        </div>
      )}
    </div>
  );
}
