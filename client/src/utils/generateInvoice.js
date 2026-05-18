import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (order, customer) => {
  const doc = new jsPDF();
  
  // Company header
  doc.setFontSize(20);
  doc.setTextColor(231, 76, 60);
  doc.text('KOMOREBI PIZZA', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Authentic Wood-Fired Pizza', 105, 28, { align: 'center' });
  
  // Invoice title
  doc.setFontSize(16);
  doc.setTextColor(44, 62, 80);
  doc.text('INVOICE', 14, 50);
  
  // Invoice details
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Invoice No: INV-${order.orderNumber}`, 14, 60);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-AU', { dateStyle: 'medium' })}`, 14, 67);
  doc.text(`Status: ${order.status.toUpperCase()}`, 14, 74);
  
  // Customer details
  doc.setFontSize(12);
  doc.setTextColor(44, 62, 80);
  doc.text('Bill To:', 120, 50);
  
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(customer.name, 120, 58);
  doc.text(customer.email, 120, 65);
  if (customer.phone) {
    doc.text(customer.phone, 120, 72);
  }
  
  if (order.deliveryAddress) {
    const addr = typeof order.deliveryAddress === 'object'
      ? [order.deliveryAddress.street, [order.deliveryAddress.city, order.deliveryAddress.postalCode].filter(Boolean).join(', ')].filter(Boolean).join('\n')
      : String(order.deliveryAddress);
    const addrLines = doc.splitTextToSize(addr, 70);
    doc.text(addrLines, 120, 79);
  }
  
  // Order items table
  const items = order.items.map((item, index) => [
    index + 1,
    item.name,
    item.quantity,
    `$${parseFloat(item.price).toFixed(2)}`,
    `$${(item.quantity * parseFloat(item.price)).toFixed(2)}`
  ]);
  
  autoTable(doc, {
    startY: 90,
    head: [['#', 'Item', 'Qty', 'Price', 'Total']],
    body: items,
    theme: 'striped',
    headStyles: {
      fillColor: [231, 76, 60],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' }
    }
  });
  
  // Summary section
  const finalY = (doc.lastAutoTable?.finalY || doc.previousAutoTable?.finalY || 120) + 10;
  
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  
  let yPos = finalY;
  const subtotal = order.items.reduce((sum, item) => sum + (item.quantity * parseFloat(item.price)), 0);
  
  doc.text('Subtotal:', 140, yPos);
  doc.text(`$${subtotal.toFixed(2)}`, 170, yPos, { align: 'right' });
  
  yPos += 8;
  if (order.discountAmount > 0) {
    doc.text(`Discount (${order.promoCode || 'Applied'}):`, 140, yPos);
    doc.text(`-$${parseFloat(order.discountAmount).toFixed(2)}`, 170, yPos, { align: 'right' });
    yPos += 8;
  }
  
  if (order.deliveryFee) {
    doc.text('Delivery Fee:', 140, yPos);
    doc.text(`$${parseFloat(order.deliveryFee).toFixed(2)}`, 170, yPos, { align: 'right' });
    yPos += 8;
  }
  
  if (order.taxAmount) {
    doc.text('GST (10%):', 140, yPos);
    doc.text(`$${parseFloat(order.taxAmount).toFixed(2)}`, 170, yPos, { align: 'right' });
    yPos += 8;
  }
  
  // Total
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(231, 76, 60);
  doc.text('TOTAL:', 140, yPos + 5);
  doc.text(`$${parseFloat(order.totalAmount).toFixed(2)}`, 170, yPos + 5, { align: 'right' });
  
  // Payment method
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Payment Method: ${order.paymentMethod || 'Pending'}`, 14, yPos + 20);
  doc.text(`Payment Status: ${order.paymentStatus || 'Pending'}`, 14, yPos + 27);
  
  // Customer notes
  if (order.customerNotes) {
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.text('Customer Notes:', 14, yPos + 40);
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const splitNotes = doc.splitTextToSize(order.customerNotes, 180);
    doc.text(splitNotes, 14, yPos + 47);
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for your order!', 105, pageHeight - 30, { align: 'center' });
  doc.text('Komorebi Pizza - Authentic Wood-Fired Pizza', 105, pageHeight - 24, { align: 'center' });
  doc.text('For inquiries, contact us at info@komorebipizza.com', 105, pageHeight - 18, { align: 'center' });
  
  // Save the PDF
  doc.save(`Invoice-${order.orderNumber}.pdf`);
};
