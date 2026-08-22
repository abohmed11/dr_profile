/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { DoctorInvoice } from '../types';
import { downloadInvoiceDirectly } from '../lib/invoiceUtils';
import { 
  X, Download, Printer, CheckCircle2, FileText
} from 'lucide-react';

interface InvoiceModalProps {
  invoice: DoctorInvoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceModal({ invoice, isOpen, onClose }: InvoiceModalProps) {
  const printableRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !invoice) return null;

  const formattedAmount = `${invoice.amount.toLocaleString('ar-EG')} ${invoice.currency || 'ج.م'}`;

  const handlePrint = () => {
    const printContent = printableRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8">
          <title>فاتورة اشتراك - ${invoice.invoiceNumber}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
          <style>
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              font-family: 'Cairo', system-ui, -apple-system, sans-serif;
            }
            body {
              background-color: #f8fafc;
              color: #0f172a;
              padding: 40px 20px;
              direction: rtl;
              text-align: right;
            }
            .invoice-card {
              max-width: 680px;
              margin: 0 auto;
              border: 1px solid #e2e8f0;
              border-radius: 24px;
              padding: 36px;
              background: #ffffff;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding-bottom: 24px;
              border-bottom: 1px solid #e2e8f0;
              margin-bottom: 24px;
            }
            .badge-verified {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              background-color: #ecfdf5;
              color: #059669;
              border: 1px solid #a7f3d0;
              padding: 3px 12px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 800;
              margin-bottom: 8px;
            }
            .inv-title {
              font-size: 22px;
              font-weight: 900;
              color: #0f172a;
              margin-bottom: 4px;
            }
            .inv-date {
              font-size: 12px;
              color: #64748b;
              font-weight: 600;
            }
            .logo-img {
              max-height: 52px;
              object-fit: contain;
            }
            .section-title {
              font-size: 14px;
              font-weight: 900;
              color: #0f172a;
              margin-bottom: 12px;
            }
            .data-table {
              width: 100%;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              overflow: hidden;
              margin-bottom: 24px;
              background: #ffffff;
              border-collapse: collapse;
            }
            .data-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 13px 18px;
              border-bottom: 1px solid #f1f5f9;
              font-size: 13px;
            }
            .data-row:last-child {
              border-bottom: none;
            }
            .data-label {
              color: #475569;
              font-weight: 700;
            }
            .data-val {
              color: #0f172a;
              font-weight: 800;
            }
            .badge-paid {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              background-color: #ecfdf5;
              color: #059669;
              border: 1px solid #a7f3d0;
              padding: 2px 10px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 800;
            }
            .total-box {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background-color: #f2fbf5;
              border: 1px solid #bbf7d0;
              border-radius: 16px;
              padding: 18px 22px;
            }
            .total-label {
              font-size: 14px;
              font-weight: 900;
              color: #0f172a;
            }
            .total-val {
              font-size: 20px;
              font-weight: 900;
              color: #059669;
            }
            .footer-notes {
              margin-top: 24px;
              padding-top: 16px;
              border-top: 1px dashed #cbd5e1;
              text-align: center;
              font-size: 11px;
              color: #94a3b8;
              line-height: 1.6;
            }
            @media print {
              body {
                padding: 0;
                background-color: #ffffff;
              }
              .invoice-card {
                border: none;
                box-shadow: none;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="header">
              <div>
                <div class="inv-title">${invoice.invoiceNumber}</div>
                <div class="inv-date">تاريخ الإصدار: ${invoice.date}</div>
              </div>
              <img src="https://l.top4top.io/p_38786d15d1.png" alt="Dr Profile" class="logo-img" />
            </div>

            <div class="section-title">بيانات الفاتورة</div>

            <div class="data-table">
              <div class="data-row">
                <span class="data-label">رقم الفاتورة</span>
                <span class="data-val">${invoice.invoiceNumber}</span>
              </div>
              <div class="data-row">
                <span class="data-label">التاريخ</span>
                <span class="data-val">${invoice.date}</span>
              </div>
              <div class="data-row">
                <span class="data-label">المبلغ</span>
                <span class="data-val">${formattedAmount}</span>
              </div>
              <div class="data-row">
                <span class="data-label">الحالة</span>
                <span class="badge-paid">✓ مدفوعة</span>
              </div>
              <div class="data-row">
                <span class="data-label">طريقة الدفع</span>
                <span class="data-val">${invoice.paymentMethod}</span>
              </div>
            </div>

            <div class="total-box">
              <span class="total-label">المبلغ الإجمالي المدفوع</span>
              <span class="total-val">${formattedAmount}</span>
            </div>

            <div class="footer-notes">
              تم إصدار هذه الفاتورة الإلكترونية رسمياً عبر منصة دكتور بروفايل الطبية.<br/>
              لأي استفسارات مالية، يرجى تزويدنا برقم الفاتورة: <strong>${invoice.invoiceNumber}</strong>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200/90 overflow-hidden my-6 text-right">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 rounded-xl transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-base font-black text-neutral-900">
            معاينة الفاتورة
          </h3>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
            title="تحميل / طباعة الفاتورة"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-600" />
            <span>تحميل / طباعة الفاتورة</span>
          </button>
        </div>

        {/* Printable / Viewable Card Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-white" ref={printableRef}>
          
          {/* Main Rounded Box matching Image 1 */}
          <div className="border border-neutral-200/80 rounded-3xl p-6 sm:p-7 bg-white space-y-6 shadow-2xs">
            
            {/* Top section: Badge + Invoice Number + Date (Right) & Logo (Left) */}
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-neutral-200/70">
              
              {/* Right Side Info in RTL */}
              <div className="space-y-1 text-right">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                  {invoice.invoiceNumber}
                </h2>

                <p className="text-xs text-neutral-500 font-semibold">
                  تاريخ الإصدار: {invoice.date}
                </p>
              </div>

              {/* Left Side Logo */}
              <div className="shrink-0 pt-1">
                <img 
                  src="https://l.top4top.io/p_38786d15d1.png" 
                  alt="Dr Profile Logo" 
                  className="h-12 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

            </div>

            {/* Section Title */}
            <div className="text-right">
              <h4 className="text-sm font-black text-neutral-900">
                بيانات الفاتورة
              </h4>
            </div>

            {/* Structured Table / Rows matching Image 1 */}
            <div className="border border-neutral-200/90 rounded-2xl divide-y divide-neutral-100 overflow-hidden text-xs sm:text-sm bg-white">
              
              {/* Row 1: رقم الفاتورة */}
              <div className="flex items-center justify-between p-3.5 px-4">
                <span className="font-bold text-neutral-900">{invoice.invoiceNumber}</span>
                <span className="font-bold text-neutral-500">رقم الفاتورة</span>
              </div>

              {/* Row 2: التاريخ */}
              <div className="flex items-center justify-between p-3.5 px-4">
                <span className="font-bold text-neutral-900">{invoice.date}</span>
                <span className="font-bold text-neutral-500">التاريخ</span>
              </div>

              {/* Row 3: المبلغ */}
              <div className="flex items-center justify-between p-3.5 px-4">
                <span className="font-black text-neutral-900">{formattedAmount}</span>
                <span className="font-bold text-neutral-500">المبلغ</span>
              </div>

              {/* Row 4: الحالة */}
              <div className="flex items-center justify-between p-3.5 px-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black text-emerald-700 bg-emerald-50/80 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>مدفوعة</span>
                </span>
                <span className="font-bold text-neutral-500">الحالة</span>
              </div>

              {/* Row 5: طريقة الدفع */}
              <div className="flex items-center justify-between p-3.5 px-4">
                <span className="font-bold text-neutral-900">{invoice.paymentMethod}</span>
                <span className="font-bold text-neutral-500">طريقة الدفع</span>
              </div>

            </div>

            {/* Total Highlight Box matching Image 1 */}
            <div className="rounded-2xl bg-[#f2fbf5] border border-[#bbf7d0] p-4 sm:p-5 flex items-center justify-between">
              <span className="text-lg sm:text-xl font-black text-emerald-600">
                {formattedAmount}
              </span>
              <span className="text-sm font-black text-neutral-900">
                المبلغ الإجمالي المدفوع
              </span>
            </div>

          </div>

        </div>

        {/* Modal Footer Buttons matching Image 1 */}
        <div className="p-4 px-6 bg-white border-t border-neutral-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => downloadInvoiceDirectly(invoice)}
            className="px-5 py-2.5 bg-[#0f1f3d] hover:bg-[#172d54] text-white text-xs font-black rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-neutral-300" />
            <span>تحميل / طباعة الفاتورة</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-black rounded-xl transition-all cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
}
