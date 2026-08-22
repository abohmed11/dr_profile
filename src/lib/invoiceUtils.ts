/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DoctorInvoice } from '../types';

export function getInvoiceHTML(invoice: DoctorInvoice): string {
  const formattedAmount = `${invoice.amount.toLocaleString('ar-EG')} ${invoice.currency || 'ج.م'}`;

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>فاتورة اشتراك - ${invoice.invoiceNumber}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
      padding: 30px 15px;
      direction: rtl;
      text-align: right;
    }
    .invoice-card {
      max-width: 650px;
      margin: 0 auto;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 32px;
      background: #ffffff;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 20px;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 20px;
    }
    .inv-title {
      font-size: 20px;
      font-weight: 900;
      color: #0f172a;
      margin-bottom: 4px;
      font-family: monospace;
    }
    .inv-date {
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
    }
    .logo-img {
      max-height: 48px;
      object-fit: contain;
    }
    .section-title {
      font-size: 13px;
      font-weight: 900;
      color: #0f172a;
      margin-bottom: 12px;
    }
    .data-table {
      width: 100%;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      overflow: hidden;
      margin-bottom: 20px;
      background: #ffffff;
    }
    .data-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 13px;
    }
    .data-row:last-child {
      border-bottom: none;
    }
    .data-label {
      color: #64748b;
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
      border-radius: 14px;
      padding: 16px 20px;
    }
    .total-label {
      font-size: 13px;
      font-weight: 900;
      color: #0f172a;
    }
    .total-val {
      font-size: 18px;
      font-weight: 900;
      color: #059669;
    }
    .footer-notes {
      margin-top: 20px;
      padding-top: 14px;
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
    window.addEventListener('load', function() {
      // فتح نافذة الطباعة / الحفظ كـ PDF تلقائياً عند فتح الملف
      setTimeout(function() {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;
}

/**
 * تحميل الفاتورة تلقائياً بالصيغة المدعومة مع الشعار الكامل وتفعيل الطباعة / الحفظ
 */
export function downloadInvoiceDirectly(invoice: DoctorInvoice): void {
  if (!invoice) return;

  const htmlContent = getInvoiceHTML(invoice);
  
  // 1. إنشاء ملف الفاتورة وتنزيله للمستخدم تلقائياً
  try {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `فاتورة_${invoice.invoiceNumber}.html`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    setTimeout(() => {
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (err) {
    console.error('Download invoice failed:', err);
  }

  // 2. تفعيل نافذة الطباعة / الحفظ كـ PDF تلقائياً
  try {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 3000);
      }, 500);
    }
  } catch (err) {
    console.error('Print iframe failed:', err);
  }
}
