import { useCallback } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const ResumePDFGenerator = () => {
  // Function to generate and download PDF
  const generatePDF = useCallback((selector, fileName = "Resume_Generated") => {
    const element = document.querySelector(selector);
    if (!element) return;

    // Convert the HTML element into a canvas
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the image to the PDF and save it
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${fileName}.pdf`);
    });
  }, []);

  // Function to generate PDF as a blob (for saving)
  const getPDFBlob = useCallback(async (selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    return pdf.output("blob");
  }, []);

  return { generatePDF, getPDFBlob };
};

export default ResumePDFGenerator;
