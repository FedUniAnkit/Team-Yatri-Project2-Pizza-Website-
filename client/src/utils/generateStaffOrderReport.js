import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatDate = (date) =>
  new Date(date).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });

export const generateStaffOrderReport = (order) => {
  if (!order) return;

  const doc = new jsPDF();
  const primary = [52, 73, 94];

  doc.setFontSize(20);
  doc.setTextColor(...primary);
  doc.text('Komorebi Pizza — Order Report', 14, 18);

  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(`Order #: ${order.orderNumber}`, 14, 28);
  doc.text(`Status: ${order.status?.toUpperCase()}`, 14, 34);
  doc.text(`Order Date: ${formatDate(order.createdAt)}`, 14, 40);

  // Customer block
  doc.setFontSize(12);
  doc.setTextColor(...primary);
  doc.text('Customer', 14, 52);
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(order.customer?.name || 'N/A', 14, 58);
  doc.text(order.customer?.email || '—', 14, 63);
  if (order.customer?.phone) {
    doc.text(order.customer.phone, 14, 68);
  }

  // Delivery block
  const rawAddr = order.deliveryAddress || {};
  doc.setFontSize(12);
  doc.setTextColor(...primary);
  doc.text('Delivery', 110, 52);
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  if (typeof rawAddr === 'string') {
    const addrLines = doc.splitTextToSize(rawAddr, 80);
    doc.text(addrLines, 110, 58);
  } else {
    doc.text(rawAddr.street || '—', 110, 58);
    doc.text([rawAddr.city, rawAddr.postalCode].filter(Boolean).join(', ') || '—', 110, 63);
  }

  // Payment block
  doc.setFontSize(12);
  doc.setTextColor(...primary);
  doc.text('Payment', 110, 75);
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Method: ${order.paymentMethod || 'N/A'}`, 110, 81);
  doc.text(`Status: ${order.paymentStatus || 'N/A'}`, 110, 86);

  // Items table
  const tableStart = 100;
  const items = (order.items || []).map((item, idx) => [
    idx + 1,
    item.name,
    item.quantity,
    `$${parseFloat(item.price).toFixed(2)}`,
    `$${(item.quantity * parseFloat(item.price)).toFixed(2)}`,
    item.customization?.specialInstructions || ''
  ]);

  autoTable(doc, {
    startY: tableStart,
    head: [['#', 'Item', 'Qty', 'Price', 'Total', 'Notes']],
    body: items,
    theme: 'striped',
    headStyles: {
      fillColor: primary,
      textColor: 255,
    },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 50 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 55 },
    },
  });

  let y = (doc.lastAutoTable?.finalY || doc.previousAutoTable?.finalY || 140) + 10;
  const subtotal = (order.items || []).reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.price),
    0
  );

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('Subtotal', 150, y);
  doc.text(`$${subtotal.toFixed(2)}`, 190, y, { align: 'right' });
  y += 7;

  if (order.discountAmount) {
    doc.text('Discount', 150, y);
    doc.text(`- $${parseFloat(order.discountAmount).toFixed(2)}`, 190, y, { align: 'right' });
    y += 7;
  }

  if (order.deliveryFee) {
    doc.text('Delivery Fee', 150, y);
    doc.text(`$${parseFloat(order.deliveryFee).toFixed(2)}`, 190, y, { align: 'right' });
    y += 7;
  }

  if (order.taxAmount) {
    doc.text('GST', 150, y);
    doc.text(`$${parseFloat(order.taxAmount).toFixed(2)}`, 190, y, { align: 'right' });
    y += 7;
  }

  doc.setFontSize(12);
  doc.setTextColor(...primary);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL', 150, y + 3);
  doc.text(`$${parseFloat(order.totalAmount).toFixed(2)}`, 190, y + 3, { align: 'right' });
  doc.setFont(undefined, 'normal');

  // Notes
  if (order.customerNotes) {
    y += 15;
    doc.setFontSize(11);
    doc.setTextColor(...primary);
    doc.text('Customer Notes', 14, y);
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
    const wrapped = doc.splitTextToSize(order.customerNotes, 180);
    doc.text(wrapped, 14, y + 6);
    y += wrapped.length * 5 + 6;
  }

  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text(
    'Generated for internal use by Komorebi Pizza staff — keep on file for auditing.',
    14,
    doc.internal.pageSize.height - 18
  );

  doc.save(`Order-${order.orderNumber}-Staff.pdf`);
};
