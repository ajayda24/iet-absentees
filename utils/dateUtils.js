// Format date to Indian format: DD-MMM-YYYY (e.g., 19-Jun-2026)
export function formatIndianDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Format date for input type="date" (YYYY-MM-DD)
export function formatDateForInput(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Get today's date in YYYY-MM-DD format
export function getTodayFormatted() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Generate date range label for export file names
export function getDateRangeLabel(startDate, endDate) {
  if (startDate && endDate) {
    const start = formatIndianDate(startDate);
    const end = formatIndianDate(endDate);
    return `${start}_to_${end}`;
  } else if (startDate) {
    return formatIndianDate(startDate);
  } else if (endDate) {
    return `till_${formatIndianDate(endDate)}`;
  } else {
    return formatIndianDate(new Date().toISOString().split("T")[0]);
  }
}
