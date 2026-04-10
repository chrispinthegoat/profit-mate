import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction, formatCurrency, calcTotal, calcProfit } from './store';

export function exportTransactionsPdf(
  transactions: Transaction[],
  currency: string,
  labels: {
    title: string;
    sales: string;
    expenses: string;
    totalSales: string;
    totalExpenses: string;
    netProfit: string;
    date: string;
    description: string;
    amount: string;
    category: string;
    noData: string;
  }
) {
  const doc = new jsPDF();
  const now = new Date().toLocaleDateString();

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`ProfitMate — ${labels.title}`, 14, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text(now, 14, 27);
  doc.setTextColor(0);

  const sales = transactions.filter(tx => tx.type === 'sale');
  const expenses = transactions.filter(tx => tx.type === 'expense');

  // Summary box
  const totalSales = calcTotal(transactions, 'sale');
  const totalExpenses = calcTotal(transactions, 'expense');
  const profit = calcProfit(transactions);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(labels.totalSales + ':', 14, 38);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(totalSales, currency), 80, 38);

  doc.setFont('helvetica', 'bold');
  doc.text(labels.totalExpenses + ':', 14, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(totalExpenses, currency), 80, 45);

  doc.setFont('helvetica', 'bold');
  doc.text(labels.netProfit + ':', 14, 52);
  doc.setFont('helvetica', 'normal');
  const profitColor = profit >= 0 ? [34, 139, 34] : [220, 20, 60];
  doc.setTextColor(profitColor[0], profitColor[1], profitColor[2]);
  doc.text(formatCurrency(profit, currency), 80, 52);
  doc.setTextColor(0);

  let y = 62;

  // Sales table
  if (sales.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`📦 ${labels.sales}`, 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [[labels.date, labels.description, labels.category, labels.amount]],
      body: sales.map(tx => [tx.date, tx.description, tx.category, formatCurrency(tx.amount, currency)]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 10;
  }

  // Expenses table
  if (expenses.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`🧾 ${labels.expenses}`, 14, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [[labels.date, labels.description, labels.category, labels.amount]],
      body: expenses.map(tx => [tx.date, tx.description, tx.category, formatCurrency(tx.amount, currency)]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [239, 68, 68] },
      margin: { left: 14 },
    });
  }

  if (transactions.length === 0) {
    doc.setFontSize(12);
    doc.text(labels.noData, 14, y + 10);
  }

  doc.save('ProfitMate_Report.pdf');
}
