import { useEffect, useState } from "react";

export function useAttendanceStorage() {
  const [allClasses, setAllClasses] = useState({});

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const stored = localStorage.getItem("attendanceClasses");
        if (stored) {
          setAllClasses(JSON.parse(stored));
        }
      } catch (error) {
        console.error("[v0] Error loading attendance data:", error);
      }
    };
    loadData();
  }, []);

  // Save data to localStorage
  const saveData = (data) => {
    try {
      localStorage.setItem("attendanceClasses", JSON.stringify(data));
      setAllClasses(data);
    } catch (error) {
      console.error("[v0] Error saving attendance data:", error);
    }
  };

  // Save single attendance record
  const saveAttendanceRecord = (record) => {
    try {
      const classId = `${record.semester}_${record.department}`;
      const updatedClasses = { ...allClasses };

      if (!updatedClasses[classId]) {
        updatedClasses[classId] = {
          classId,
          semester: record.semester,
          department: record.department,
          records: [],
        };
      }

      // Check for duplicate
      const today = new Date().toISOString().split("T")[0];
      const isDuplicate = updatedClasses[classId].records.some(
        (r) =>
          r.date === today &&
          r.hour === record.hour &&
          r.subject === record.subject
      );

      if (isDuplicate) {
        return { success: false, message: "Attendance already recorded for this hour today" };
      }

      // Create new record
      const newRecord = {
        id: `${classId}_${today}_${record.hour}_${record.subject || "none"}`,
        date: today,
        hour: record.hour,
        subject: record.subject || "",
        totalStudents: record.totalStudents,
        absentees: record.absentees,
        presentCount: record.totalStudents - record.absentees.length,
        absenteePercentage:
          record.totalStudents > 0
            ? ((record.absentees.length / record.totalStudents) * 100).toFixed(2)
            : 0,
        createdAt: Date.now(),
      };

      updatedClasses[classId].records.push(newRecord);
      saveData(updatedClasses);

      return { success: true, message: "Attendance saved successfully", record: newRecord };
    } catch (error) {
      console.error("[v0] Error saving record:", error);
      return { success: false, message: "Failed to save attendance" };
    }
  };

  // Get records for a specific class
  const getRecordsByClass = (semester, department) => {
    const classId = `${semester}_${department}`;
    return allClasses[classId]?.records || [];
  };

  // Get records with filtering
  const getRecordsByFilter = (semester, department, filters = {}) => {
    const classId = `${semester}_${department}`;
    let records = allClasses[classId]?.records || [];

    // Filter by subject
    if (filters.subject) {
      records = records.filter((r) => r.subject === filters.subject);
    }

    // Filter by date range
    if (filters.startDate) {
      records = records.filter((r) => r.date >= filters.startDate);
    }
    if (filters.endDate) {
      records = records.filter((r) => r.date <= filters.endDate);
    }

    // Filter by hour
    if (filters.hour) {
      records = records.filter((r) => r.hour === filters.hour);
    }

    return records;
  };

  // Get monthly report for a class
  const getMonthlyReport = (semester, department, year, month) => {
    const records = getRecordsByClass(semester, department);
    const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
    const monthEnd = new Date(year, month, 0)
      .toISOString()
      .split("T")[0];

    const monthlyRecords = records.filter(
      (r) => r.date >= monthStart && r.date <= monthEnd
    );

    // Group by subject if applicable
    const bySubject = {};
    monthlyRecords.forEach((record) => {
      const subject = record.subject || "No Subject";
      if (!bySubject[subject]) {
        bySubject[subject] = [];
      }
      bySubject[subject].push(record);
    });

    return {
      semester,
      department,
      year,
      month,
      totalRecords: monthlyRecords.length,
      records: monthlyRecords,
      bySubject,
    };
  };

  // Delete a record
  const deleteRecord = (semester, department, recordId) => {
    try {
      const classId = `${semester}_${department}`;
      const updatedClasses = { ...allClasses };

      if (updatedClasses[classId]) {
        updatedClasses[classId].records = updatedClasses[classId].records.filter(
          (r) => r.id !== recordId
        );
        saveData(updatedClasses);
        return { success: true, message: "Record deleted" };
      }

      return { success: false, message: "Class not found" };
    } catch (error) {
      console.error("[v0] Error deleting record:", error);
      return { success: false, message: "Failed to delete record" };
    }
  };

  // Get all classes
  const getAllClasses = () => {
    return Object.keys(allClasses).map((classId) => ({
      classId,
      semester: allClasses[classId].semester,
      department: allClasses[classId].department,
      recordCount: allClasses[classId].records.length,
    }));
  };

  // Get all subjects for a class
  const getSubjectsForClass = (semester, department) => {
    const records = getRecordsByClass(semester, department);
    const subjects = new Set(records.map((r) => r.subject || "No Subject"));
    return Array.from(subjects).sort();
  };

  // Export to JSON
  const exportToJSON = () => {
    try {
      const dataStr = JSON.stringify(allClasses, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance_backup_${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      return { success: true, message: "Data exported successfully" };
    } catch (error) {
      console.error("[v0] Error exporting data:", error);
      return { success: false, message: "Failed to export data" };
    }
  };

  return {
    allClasses,
    saveAttendanceRecord,
    getRecordsByClass,
    getRecordsByFilter,
    getMonthlyReport,
    deleteRecord,
    getAllClasses,
    getSubjectsForClass,
    exportToJSON,
  };
}
