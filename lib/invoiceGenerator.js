// lib/invoiceGenerator.js
import jsPDF from "jspdf";
import "jspdf-autotable";

// Utility to format numbers into INR currency style
const formatINR = (num) => {
  if (typeof num !== "number") num = parseFloat(num) || 0;
  const parts = num.toFixed(2).split(".");
  const beforeDecimal = parts[0];
  const afterDecimal = parts[1];
  const lastThree = beforeDecimal.slice(-3);
  const otherNumbers = beforeDecimal.slice(0, -3);
  const formatted =
    (otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") || "") +
    (otherNumbers ? "," : "") +
    lastThree +
    "." +
    afterDecimal;
  return formatted.endsWith(".00") ? formatted.slice(0, -3) : formatted;
};

export const generateInvoice = (order) => {
  if (!order) {
    console.error("generateInvoice: order data is required.");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Invoice", 14, 20);

  doc.setFontSize(12);
  doc.text(`Order ID: ${order.orderId}`, 14, 30);
  doc.text(`Date: ${new Date(order.orderDate).toLocaleString()}`, 14, 38);
  if (order.paymentId) doc.text(`Payment ID: ${order.paymentId}`, 14, 46);

  const items = order.items.map((item) => [
    item.name,
    item.quantity,
    `₹${formatINR(item.price)}`,
    `₹${formatINR(item.price * item.quantity)}`,
  ]);

  doc.autoTable({
    startY: 55,
    head: [["Item", "Qty", "Price", "Total"]],
    body: items,
  });

  const finalY = doc.lastAutoTable.finalY || 80;

  doc.setFontSize(12);
  doc.text("Summary:", 14, finalY + 10);

  const summary = [
    ["Subtotal", `₹${formatINR(order.pricing.subtotal)}`],
    ["Shipping", `₹${formatINR(order.pricing.shipping)}`],
    ["GST (12%)", `₹${formatINR(order.pricing.taxAmount)}`],
    order.pricing.discountAmount > 0
      ? ["Discount", `-₹${formatINR(order.pricing.discountAmount)}`]
      : null,
    ["Total", `₹${formatINR(order.pricing.total)}`],
  ].filter(Boolean);

  summary.forEach(([label, value], i) => {
    doc.text(`${label}: ${value}`, 14, finalY + 20 + i * 8);
  });

  doc.save(`Invoice_${order.orderId}.pdf`);
};
