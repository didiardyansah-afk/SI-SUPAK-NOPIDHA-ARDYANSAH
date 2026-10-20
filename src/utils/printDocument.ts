/**
 * Utility to print any document element cleanly in an isolated iframe
 * without printing browser UI, sidebars, or headers.
 */
export const printHtmlElement = (elementId: string, docTitle: string = 'Dokumen SI SUPAK') => {
  const el = document.querySelector(elementId) as HTMLElement | null;
  if (!el) {
    window.print();
    return;
  }

  // Remove any previously created print iframes
  const oldIframe = document.getElementById('si-supak-print-iframe');
  if (oldIframe) {
    document.body.removeChild(oldIframe);
  }

  // Create isolated invisible iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'si-supak-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    window.print();
    return;
  }

  iframeDoc.open();
  iframeDoc.write(`
    <!doctype html>
    <html lang="id">
      <head>
        <meta charset="utf-8">
        <title>${docTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cinzel:wght@700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 0;
            font-size: 11pt;
            line-height: 1.45;
          }
          .print-hide, .no-print, button {
            display: none !important;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 4px;
            margin-bottom: 4px;
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          th, td {
            padding: 5px 7px;
            border: 1px solid #94a3b8;
            font-size: 9pt;
          }
          th {
            background-color: #f1f5f9 !important;
            font-weight: 700;
          }
          .border-b-2 { border-bottom: 2px solid #000 !important; }
          .border-t-2 { border-top: 2px solid #000 !important; }
          .border-t { border-top: 1px solid #000 !important; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .font-bold { font-weight: 700; }
          .font-extrabold { font-weight: 800; }
          .font-black { font-weight: 900; }
          .uppercase { text-transform: uppercase; }
          .underline { text-decoration: underline; }
          .text-xs { font-size: 8.5pt; }
          .text-sm { font-size: 9.5pt; }
          .text-base { font-size: 11pt; }
          .text-lg { font-size: 13pt; }
          .text-xl { font-size: 15pt; }
          .text-2xl { font-size: 17pt; }
          .text-3xl { font-size: 20pt; }
          .text-slate-500 { color: #64748b; }
          .text-slate-600 { color: #475569; }
          .text-slate-700 { color: #334155; }
          .text-slate-800 { color: #1e293b; }
          .text-slate-900 { color: #0f172a; }
          .bg-slate-50 { background-color: #f8fafc !important; }
          .bg-slate-100 { background-color: #f1f5f9 !important; }
          .bg-indigo-50 { background-color: #eef2ff !important; }
          .bg-emerald-50 { background-color: #ecfdf5 !important; }
          .bg-amber-50 { background-color: #fffbeb !important; }
          .grid { display: flex; flex-wrap: wrap; }
          .grid-cols-2 > div { width: 50%; }
          .grid-cols-3 > div { width: 33.333%; }
        </style>
      </head>
      <body>
        <div style="width: 100%; max-width: 100%;">
          ${el.innerHTML}
        </div>
      </body>
    </html>
  `);
  iframeDoc.close();

  // Trigger print after iframe finishes rendering
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.warn('Iframe print error, falling back to window.print():', err);
      window.print();
    }
  }, 400);
};
