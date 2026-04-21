import jsPDF from "jspdf";

export interface ReceiptData {
  referenceCode: string;
  experienceTitle: string;
  experienceType: "event" | "session" | string;
  category?: string | null;
  organizer?: string | null;
  location?: string | null;
  date: string; // formatted
  time?: string | null;
  quantity: number;
  unitPrice: string; // formatted
  total: string; // formatted
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  status: string;
  createdAt?: string; // formatted
  specialRequests?: string | null;
}

const COLORS = {
  pink: [255, 0, 128] as [number, number, number],
  cyan: [0, 229, 255] as [number, number, number],
  ink: [20, 20, 28] as [number, number, number],
  muted: [110, 110, 120] as [number, number, number],
  line: [220, 220, 228] as [number, number, number],
};

export function buildReceiptPdf(data: ReceiptData): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = margin;

  // Header band
  doc.setFillColor(...COLORS.pink);
  doc.rect(0, 0, pageW, 8, "F");
  doc.setFillColor(...COLORS.cyan);
  doc.rect(0, 8, pageW, 2, "F");

  y = margin + 8;
  doc.setTextColor(...COLORS.ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("InaniVibes", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.muted);
  doc.text("Experience Reservation Receipt", pageW - margin, y, { align: "right" });

  // Reference code box
  y += 28;
  doc.setDrawColor(...COLORS.cyan);
  doc.setLineWidth(1);
  doc.roundedRect(margin, y, pageW - margin * 2, 60, 6, 6);
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text("REFERENCE CODE", margin + 16, y + 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.ink);
  doc.text(data.referenceCode, margin + 16, y + 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  doc.text(`Status: ${data.status.toUpperCase()}`, pageW - margin - 16, y + 20, { align: "right" });
  if (data.createdAt) {
    doc.text(`Issued: ${data.createdAt}`, pageW - margin - 16, y + 38, { align: "right" });
  }

  y += 84;

  // Experience title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...COLORS.ink);
  const titleLines = doc.splitTextToSize(data.experienceTitle, pageW - margin * 2);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 18 + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.muted);
  const meta: string[] = [];
  if (data.category) meta.push(data.category);
  if (data.experienceType) meta.push(data.experienceType === "event" ? "Event" : "Adventure session");
  if (data.organizer) meta.push(`by ${data.organizer}`);
  if (meta.length) {
    doc.text(meta.join(" · "), margin, y);
    y += 16;
  }

  y += 8;
  doc.setDrawColor(...COLORS.line);
  doc.line(margin, y, pageW - margin, y);
  y += 18;

  // Details rows
  const row = (label: string, value?: string | null) => {
    if (!value) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.muted);
    doc.text(label.toUpperCase(), margin, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.ink);
    const valueLines = doc.splitTextToSize(value, pageW - margin * 2 - 140);
    doc.text(valueLines, margin + 140, y);
    y += Math.max(18, valueLines.length * 14) + 6;
  };

  row("Date", data.date);
  row("Time", data.time || undefined);
  row("Location", data.location || undefined);
  row(data.experienceType === "event" ? "Tickets" : "Participants", String(data.quantity));

  y += 6;
  doc.setDrawColor(...COLORS.line);
  doc.line(margin, y, pageW - margin, y);
  y += 18;

  // Guest block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.ink);
  doc.text("Guest", margin, y);
  y += 16;
  row("Name", data.guestName);
  row("Email", data.guestEmail);
  row("Phone", data.guestPhone || undefined);
  if (data.specialRequests) row("Notes", data.specialRequests);

  y += 6;
  doc.setDrawColor(...COLORS.line);
  doc.line(margin, y, pageW - margin, y);
  y += 22;

  // Total block
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.muted);
  doc.text(`${data.quantity} × ${data.unitPrice}`, margin, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...COLORS.pink);
  doc.text(`Total ${data.total}`, pageW - margin, y + 4, { align: "right" });

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 40;
  doc.setDrawColor(...COLORS.line);
  doc.line(margin, footerY - 16, pageW - margin, footerY - 16);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text(
    "Show this receipt at check-in. Confirmation by the InaniVibes team usually within 30 minutes.",
    margin,
    footerY,
  );
  doc.text("inanivibes.com", pageW - margin, footerY, { align: "right" });

  return doc;
}

export function downloadReceiptPdf(data: ReceiptData) {
  const doc = buildReceiptPdf(data);
  doc.save(`InaniVibes-${data.referenceCode}.pdf`);
}

export async function shareReceiptPdf(data: ReceiptData): Promise<"shared" | "downloaded"> {
  const doc = buildReceiptPdf(data);
  const blob = doc.output("blob");
  const file = new File([blob], `InaniVibes-${data.referenceCode}.pdf`, { type: "application/pdf" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare && nav.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: `InaniVibes Reservation ${data.referenceCode}`,
        text: `${data.experienceTitle} — ${data.date}`,
      });
      return "shared";
    } catch {
      // user cancelled or share failed — fall through to download
    }
  }
  doc.save(`InaniVibes-${data.referenceCode}.pdf`);
  return "downloaded";
}

export const buildReferenceCode = (id: string) =>
  `IV-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;