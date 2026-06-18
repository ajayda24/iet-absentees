"use client";

import { useState, useMemo } from "react";
import { useAttendanceStorage } from "@/hooks/useAttendanceStorage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDown, Copy, Trash2, ChevronLeft, Check, X } from "lucide-react";
import { toast } from "sonner";
import { exportTableToPDF, exportTableAsImage, copyTableToClipboard } from "@/utils/exportUtils";
import { formatIndianDate, getTodayFormatted, getDateRangeLabel } from "@/utils/dateUtils";
import Link from "next/link";

export default function ReportsPage() {
  const { getAllClasses, getRecordsByClass, deleteRecord } = useAttendanceStorage();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(getTodayFormatted());

  const classes = getAllClasses();
  const records = selectedClass ? getRecordsByClass(selectedClass) : [];

  const filteredRecords = useMemo(() => {
    if (!selectedClass) return [];

    let filtered = records;

    if (selectedSubject && selectedSubject !== "all") {
      filtered = filtered.filter((r) => r.subject === selectedSubject);
    }

    if (startDate) {
      filtered = filtered.filter((record) => new Date(record.date) >= new Date(startDate));
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((record) => new Date(record.date) <= end);
    }

    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [records, selectedClass, selectedSubject, startDate, endDate]);

  // Build matrix data structure
  const matrixData = useMemo(() => {
    if (filteredRecords.length === 0) return null;

    // Get unique dates and build date-hour mapping
    const dateHourMap = new Map();
    const studentMap = new Map();
    const attendanceMatrix = new Map();

    filteredRecords.forEach((record) => {
      const dateKey = record.date;
      if (!dateHourMap.has(dateKey)) {
        dateHourMap.set(dateKey, new Set());
      }
      dateHourMap.get(dateKey).add(record.hour);

      // Build student data
      for (let i = 1; i <= record.totalStudents; i++) {
        if (!studentMap.has(i)) {
          studentMap.set(i, {
            rollNo: i,
            totalClasses: 0,
            presentClasses: 0,
          });
        }

        const cellKey = `${i}_${dateKey}_${record.hour}`;
        const isPresent = !record.absentees.includes(i);
        attendanceMatrix.set(cellKey, isPresent);

        const student = studentMap.get(i);
        student.totalClasses++;
        if (isPresent) student.presentClasses++;
      }
    });

    const sortedDates = Array.from(dateHourMap.keys()).sort();
    const dateHourArray = sortedDates.map((date) => ({
      date,
      hours: Array.from(dateHourMap.get(date)).sort((a, b) => {
        const hourOrder = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
        return hourOrder.indexOf(a) - hourOrder.indexOf(b);
      }),
    }));

    return {
      dateHourArray,
      studentArray: Array.from(studentMap.values()),
      attendanceMatrix,
    };
  }, [filteredRecords]);

  const subjectsInClass = useMemo(() => {
    if (!selectedClass) return [];
    const subjects = new Set(records.map((r) => r.subject).filter(Boolean));
    return Array.from(subjects);
  }, [records, selectedClass]);

  const handleExport = async (type) => {
    const fileName = `attendance_${selectedClass || "report"}_${getDateRangeLabel(startDate, endDate)}`;

    if (type === "pdf") {
      const result = await exportTableToPDF("attendance-matrix-table", fileName);
      toast[result.success ? "success" : "error"](result.message);
    } else if (type === "image") {
      const result = await exportTableAsImage("attendance-matrix-table", fileName);
      toast[result.success ? "success" : "error"](result.message);
    } else if (type === "copy") {
      const result = await copyTableToClipboard("attendance-matrix-table");
      toast[result.success ? "success" : "error"](result.message);
    }
  };

  const handleDeleteRecord = (recordId) => {
    deleteRecord(recordId);
    toast.success("Record deleted", { duration: 2000 });
  };

  const totalClasses = filteredRecords.length;
  const avgAttendance = matrixData
    ? (
        (matrixData.studentArray.reduce((sum, s) => sum + (s.presentClasses / s.totalClasses) * 100, 0) /
          matrixData.studentArray.length) || 0
      ).toFixed(2)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Attendance Reports</h1>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Class Selection */}
            <div className="space-y-2">
              <Label htmlFor="class-select">Class (Semester - Department)</Label>
              {classes.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground bg-gray-50 rounded border">
                  No classes yet
                </div>
              ) : (
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger id="class-select">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classData) => (
                      <SelectItem key={classData.classId} value={classData.classId}>
                        {classData.semester} - {classData.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Subject Filter */}
            {selectedClass && subjectsInClass.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="subject-select">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjectsInClass.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* No Selection Message */}
        {!selectedClass && (
          <Card className="p-8 text-center text-muted-foreground">
            <p>Select a class to view attendance records</p>
          </Card>
        )}

        {/* Summary Stats */}
        {selectedClass && matrixData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Total Classes</p>
              <p className="text-2xl font-bold">{totalClasses}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Average Attendance</p>
              <p className="text-2xl font-bold">{avgAttendance}%</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">{matrixData.studentArray.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Date Range</p>
              <p className="text-sm font-semibold">{formatIndianDate(startDate || getTodayFormatted())} to {formatIndianDate(endDate || getTodayFormatted())}</p>
            </Card>
          </div>
        )}

        {/* Attendance Matrix Table */}
        {selectedClass && matrixData && (
          <>
            <Card className="p-6 mb-6 overflow-x-auto" id="attendance-matrix-table">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left p-2 font-semibold bg-gray-100 sticky left-0 z-10" style={{ minWidth: "100px" }}>
                      Roll No.
                    </th>
                    {matrixData.dateHourArray.map((dateHour) => (
                      <th key={dateHour.date} colSpan={dateHour.hours.length} className="text-center font-semibold bg-blue-50 border-r">
                        <div className="text-xs font-bold">{formatIndianDate(dateHour.date)}</div>
                        <div className="flex text-xs text-muted-foreground border-t">
                          {dateHour.hours.map((hour) => (
                            <div key={hour} className="flex-1 border-r last:border-r-0 py-1">
                              {hour}
                            </div>
                          ))}
                        </div>
                      </th>
                    ))}
                    <th className="text-center p-2 font-semibold bg-green-50 sticky right-0 z-10" style={{ minWidth: "100px" }}>
                      Attendance %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {matrixData.studentArray.map((student) => (
                    <tr key={student.rollNo} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-semibold bg-gray-50 sticky left-0 z-10">
                        {student.rollNo}
                      </td>
                      {matrixData.dateHourArray.map((dateHour) =>
                        dateHour.hours.map((hour) => {
                          const cellKey = `${student.rollNo}_${dateHour.date}_${hour}`;
                          const isPresent = matrixData.attendanceMatrix.get(cellKey);
                          return (
                            <td key={cellKey} className="p-2 text-center border-r">
                              {isPresent === undefined ? (
                                <span className="text-gray-300">-</span>
                              ) : isPresent ? (
                                <Check className="h-4 w-4 text-green-600 inline" />
                              ) : (
                                <X className="h-4 w-4 text-red-600 inline" />
                              )}
                            </td>
                          );
                        })
                      )}
                      <td className="p-2 text-center font-semibold bg-green-50 sticky right-0 z-10">
                        {student.totalClasses > 0
                          ? ((student.presentClasses / student.totalClasses) * 100).toFixed(1)
                          : 0}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Export Buttons */}
            <div className="flex gap-3 mb-6">
              <Button onClick={() => handleExport("pdf")} className="gap-2">
                <FileDown className="h-4 w-4" />
                Export PDF
              </Button>
              <Button onClick={() => handleExport("image")} variant="outline" className="gap-2">
                <Copy className="h-4 w-4" />
                Export as Image
              </Button>
              <Button onClick={() => handleExport("copy")} variant="outline" className="gap-2">
                <Copy className="h-4 w-4" />
                Copy Table
              </Button>
            </div>
          </>
        )}

        {/* No Records Message */}
        {selectedClass && !matrixData && (
          <Card className="p-8 text-center text-muted-foreground">
            <p>No attendance records found for the selected filters</p>
          </Card>
        )}
      </div>
    </div>
  );
}
