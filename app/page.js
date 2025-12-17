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
import { toast } from "sonner";

import StudentCard from "@/components/StudentCard";
import { Card } from "@/components/ui/card";
import RadioCardGroup from "@/components/RadioCardGroup";

export default function Home() {
  const [totalStudents, setTotalStudents] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [markAllPresentClciked, setMarkAllPresentClicked] = useState(false);

  const [absentees, setAbsentees] = useState([]);

  const studentsArray = Array.from({ length: totalStudents }, (_, i) => ({
    id: i + 1,
    status: "present",
  }));
  const departmentsArray = ["IT", "CSE", "EC", "EEE", "ME", "EP", "PT"];
  const semestersArray = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
  const hoursArray = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  const copyText = () => {
    const textToCopy = `<b>Today's Absentees<b>\n
      Date: ${formattedDate}
      ${selectedSemester} - ${selectedDepartment}
      ${selectedHour && `${selectedHour} Hour`} 
      Absentees: ${absentees.join(", ")}`;

    navigator.clipboard.writeText(textToCopy);
    toast.success("Copied to clipboard", {
      position: "top-right",
      duration: 2000,
    });
  };

  const copyRollNoOnly = () => {
    const textToCopy = `${absentees.join(", ")}`;
    navigator.clipboard.writeText(textToCopy);
    toast.success("Copied Roll No. only.", {
      position: "top-right",
      duration: 2000,
    });
  };

  const toggleStatus = (id) => {
    setAbsentees((prev) => {
      const newAbsentees = prev.includes(id)
        ? prev.filter((absentId) => absentId !== id)
        : [...prev, id];

      return newAbsentees.sort((a, b) => a - b);
    });
  };

  const semesterOptions = semestersArray.map((s) => ({
    label: s,
    value: s,
  }));

  const departmentOptions = departmentsArray.map((d) => ({
    label: d,
    value: d,
  }));

  const hourOptions = hoursArray.map((h) => ({
    label: h,
    value: h,
  }));

  const markAllPresent = () => {
    setAbsentees([]);
    setMarkAllPresentClicked(true);
    toast.success("All students marked present", {
      position: "top-right",
      duration: 1500,
    });
  };

  const markAllAbsent = () => {
    const allAbsent = studentsArray.map((s) => s.id);
    setAbsentees(allAbsent);
    toast.error("All students marked absent", {
      position: "top-right",
      duration: 1500,
    });
  };

  return (
    <div className="flex flex-col items-center p-4 py-6">
      <div className="max-w-sm w-full flex flex-col gap-6">
        <h1 className="text-center text-xl">IET Absentees</h1>

        <RadioCardGroup
          title="Select Semester"
          options={semesterOptions}
          value={selectedSemester}
          onChange={setSelectedSemester}
        />

        <RadioCardGroup
          title="Select Department"
          options={departmentOptions}
          value={selectedDepartment}
          onChange={setSelectedDepartment}
        />

        <RadioCardGroup
          title="Select Hour"
          options={hourOptions}
          value={selectedHour}
          onChange={setSelectedHour}
        />

        <div className="grid gap-1.5">
          <Label>Total Students</Label>
          <Input
            type="number"
            value={totalStudents}
            onChange={(e) => setTotalStudents(e.target.value)}
            disabled={!selectedDepartment || !selectedSemester}
          />
          {!selectedDepartment || !selectedSemester ? (
            <p className="text-xs text-muted-foreground">
              First Select Semester and Department
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium ">Quick Mark</p>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="rounded-xl border-green-500 text-green-600 hover:bg-green-500/10"
              onClick={markAllPresent}
              disabled={!totalStudents}
            >
              Mark All Present
            </Button>

            <Button
              variant="outline"
              className="rounded-xl border-red-500 text-red-600 hover:bg-red-500/10"
              onClick={markAllAbsent}
              disabled={!totalStudents}
            >
              Mark All Absent
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 justify-center gap-3 my-10 max-w-xl">
        {selectedDepartment &&
          selectedSemester &&
          studentsArray.map((student) => {
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

      {(absentees.length > 0 || markAllPresentClciked) && (
        <Card
          className={`transition-all duration-150 p-3 max-w-sm w-full flex justify-center items-center`}
        >
          <div className="w-full flex flex-col gap-3">
            <h2 className="font-medium">{`Today's Absentees`}</h2>
            <h3>Date : {formattedDate}</h3>
            <h3>
              {selectedSemester} - {selectedDepartment}
            </h3>
            {selectedHour && <h3>Hour : {selectedHour}</h3>}
            <h3 onClick={copyRollNoOnly}>Absentees : {absentees.join(", ")}</h3>
            <Button
              className=" text-sm font-light border-green-400 bg-green-950"
              onClick={copyText}
            >
              Copy to Clipboard
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
