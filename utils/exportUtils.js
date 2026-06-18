import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";

export const exportTableToPDF = async (elementId, fileName = "attendance_report") => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Element not found");
    }

    const opt = {
      margin: 10,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
    };

    html2pdf().set(opt).from(element).save();
    return { success: true, message: "PDF exported successfully" };
  } catch (error) {
    console.error("PDF export error:", error);
    return { success: false, message: "Failed to export PDF" };
  }
};

export const exportTableAsImage = async (elementId, fileName = "attendance_report") => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Element not found");
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${fileName}.png`;
    link.click();

    return { success: true, message: "Image exported successfully" };
  } catch (error) {
    console.error("Image export error:", error);
    return { success: false, message: "Failed to export as image" };
  }
};

export const copyTableToClipboard = async (elementId) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Element not found");
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    canvas.toBlob((blob) => {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]);
    });

    return { success: true, message: "Copied to clipboard" };
  } catch (error) {
    console.error("Clipboard copy error:", error);
    return { success: false, message: "Failed to copy to clipboard" };
  }
};
