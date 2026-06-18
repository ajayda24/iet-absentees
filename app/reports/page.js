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
import { FileDown, Copy, Trash2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { exportTableToPDF, exportTableAsImage, copyTableToClipboard } from "@/utils/exportUtils";
import Link from "next/link";

export default function ReportsPage() {
  const { getAllClasses, getRecordsByClass, deleteRecord } = useAttendanceStorage();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const classes = getAllClasses();
  const records = selectedClass ? getRecordsByClass(selectedClass) : [];

  const filteredRecords = useMemo(() => {
    let filtered = records;

    if (selectedSubject) {
      filtered = filtered.filter(
        (record) => record.subject && record.subject.toLowerCase() === selectedSubject.toLowerCase()
      );
    }

    if (startDate) {
      filtered = filtered.filter((record) => new Date(record.date) >= new Date(startDate));
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((record) => new Date(record.date) <= end);
    }

    // Add percentage field to each record if not already present
    const withPercentage = filtered.map((record) => ({
      ...record,
      percentage: record.absenteePercentage || (record.totalStudents > 0 ? ((record.absentees.length / record.totalStudents) * 100).toFixed(2) : 0),
    }));

    return withPercentage.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [records, selectedSubject, startDate, endDate]);

  const subjectsInClass = useMemo(() => {
    return [...new Set(records.map((r) => r.subject).filter(Boolean))];
  }, [records]);

  const monthlyStats = useMemo(() => {
    const stats = {};
    filteredRecords.forEach((record) => {
      const date = new Date(record.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!stats[month]) {
        stats[month] = {
          totalRecords: 0,
          totalStudents: 0,
          totalPresent: 0,
          totalAbsent: 0,
        };
      }

      stats[month].totalRecords += 1;
      stats[month].totalStudents += record.totalStudents;
      stats[month].totalPresent += record.presentCount;
      stats[month].totalAbsent += record.absentees.length;
    });

    return Object.entries(stats)
      .sort(([monthA], [monthB]) => monthB.localeCompare(monthA))
      .map(([month, data]) => ({
        month,
        ...data,
        percentage: data.totalStudents > 0 ? ((data.totalPresent / data.totalStudents) * 100).toFixed(2) : 0,
      }));
  }, [filteredRecords]);

  const handleDelete = (recordId) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteRecord(selectedClass, recordId);
      toast.success("Record deleted successfully");
    }
  };

  const handleExportPDF = async () => {
    const result = await exportTableToPDF("reportTable", `attendance_report_${new Date().toISOString().split("T")[0]}`);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleExportImage = async () => {
    const result = await exportTableAsImage("reportTable", `attendance_report_${new Date().toISOString().split("T")[0]}`);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleCopyTable = async () => {
    const result = await copyTableToClipboard("reportTable");
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pt-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Attendance Reports</h1>
            <p className="text-sm text-muted-foreground">View and export attendance data</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
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
            {subjectsInClass.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="subject-select">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject-select">
                    <SelectValue placeholder="All subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Subjects</SelectItem>
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

        {/* Export Buttons */}
        {filteredRecords.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-700">
              <FileDown className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={handleExportImage} variant="outline">
              <FileDown className="h-4 w-4 mr-2" />
              Export as Image
            </Button>
            <Button onClick={handleCopyTable} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Copy Table
            </Button>
          </div>
        )}

        {/* Content */}
        {!selectedClass ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Select a class to view attendance records</p>
          </Card>
        ) : filteredRecords.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No attendance records found for the selected filters</p>
          </Card>
        ) : (
          <>
            {/* Monthly Summary */}
            {monthlyStats.length > 0 && (
              <Card className="p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Monthly Summary</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-2 px-4 font-semibold">Month</th>
                        <th className="text-center py-2 px-4 font-semibold">Classes</th>
                        <th className="text-center py-2 px-4 font-semibold">Total Students</th>
                        <th className="text-center py-2 px-4 font-semibold">Present</th>
                        <th className="text-center py-2 px-4 font-semibold">Absent</th>
                        <th className="text-center py-2 px-4 font-semibold">Attendance %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyStats.map((stat) => (
                        <tr key={stat.month} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">{stat.month}</td>
                          <td className="text-center py-2 px-4">{stat.totalRecords}</td>
                          <td className="text-center py-2 px-4">{stat.totalStudents}</td>
                          <td className="text-center py-2 px-4 text-green-600 font-medium">{stat.totalPresent}</td>
                          <td className="text-center py-2 px-4 text-red-600 font-medium">{stat.totalAbsent}</td>
                          <td className="text-center py-2 px-4 font-medium">{stat.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Detailed Records Table */}
            <Card id="reportTable" className="p-6 overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4">Detailed Records</h2>
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-center py-3 px-4 font-semibold">Hour</th>
                    <th className="text-left py-3 px-4 font-semibold">Subject</th>
                    <th className="text-center py-3 px-4 font-semibold">Total</th>
                    <th className="text-center py-3 px-4 font-semibold">Present</th>
                    <th className="text-center py-3 px-4 font-semibold">Absent</th>
                    <th className="text-center py-3 px-4 font-semibold">Attendance %</th>
                    <th className="text-center py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="text-center py-3 px-4">{record.hour}</td>
                      <td className="py-3 px-4">{record.subject || "-"}</td>
                      <td className="text-center py-3 px-4 font-medium">{record.totalStudents}</td>
                      <td className="text-center py-3 px-4 text-green-600 font-medium">{record.presentCount}</td>
                      <td className="text-center py-3 px-4 text-red-600 font-medium">{record.absentees.length}</td>
                      <td className="text-center py-3 px-4 font-medium">{record.percentage}%</td>
                      <td className="text-center py-3 px-4">
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-1 hover:bg-red-100 rounded text-red-600"
                          title="Delete record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
