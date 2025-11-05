/**
 * Export report to PDF (basic implementation)
 * This is a simplified version - in production, you'd use a library like jsPDF or pdfmake
 * @param {Object} reportData - Report data from reportGenerator
 * @param {string} filename - Name of the PDF file
 */
export async function exportReportToPDF(reportData, filename = 'report.pdf') {
  // Create HTML content for the report
  const htmlContent = generateReportHTML(reportData);
  
  // Create a new window with the report
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load, then print (which allows saving as PDF)
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}

/**
 * Generate HTML content for report
 * @param {Object} reportData - Report data
 * @returns {string} HTML content
 */
function generateReportHTML(reportData) {
  const { type, totalHours, jobCount, entryCount } = reportData;
  
  const typeLabels = {
    daily: 'Dzienny',
    weekly: 'Tygodniowy',
    monthly: 'Miesięczny',
    yearly: 'Roczny',
  };

  const dateRange = reportData.type === 'daily'
    ? reportData.date
    : reportData.type === 'weekly'
      ? `${reportData.startDate} - ${reportData.endDate}`
      : reportData.type === 'monthly'
        ? `${reportData.year}-${String(reportData.month).padStart(2, '0')}`
        : `${reportData.year}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Raport ${typeLabels[type]}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      color: #333;
      border-bottom: 2px solid #1173d4;
      padding-bottom: 10px;
    }
    .report-info {
      margin: 20px 0;
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 5px;
    }
    .metric {
      display: inline-block;
      margin: 10px 20px 10px 0;
      padding: 10px;
      background-color: white;
      border-radius: 5px;
      min-width: 150px;
    }
    .metric-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }
    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #1173d4;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #1173d4;
      color: white;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <h1>Raport ${typeLabels[type]}</h1>
  
  <div class="report-info">
    <p><strong>Okres:</strong> ${dateRange}</p>
    <p><strong>Data wygenerowania:</strong> ${new Date().toLocaleString('pl-PL')}</p>
  </div>

  <div class="metric">
    <div class="metric-label">Łączny czas</div>
    <div class="metric-value">${totalHours} h</div>
  </div>
  
  <div class="metric">
    <div class="metric-label">Liczba zleceń</div>
    <div class="metric-value">${jobCount}</div>
  </div>
  
  <div class="metric">
    <div class="metric-label">Liczba wpisów</div>
    <div class="metric-value">${entryCount}</div>
  </div>

  ${reportData.entries && reportData.entries.length > 0 ? `
  <table>
    <thead>
      <tr>
        <th>Data</th>
        <th>Czas</th>
        <th>Zlecenie ID</th>
      </tr>
    </thead>
    <tbody>
      ${reportData.entries.map(entry => {
        const entryDate = new Date(entry.startTime);
        const duration = entry.duration || 0;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        return `
        <tr>
          <td>${entryDate.toLocaleString('pl-PL')}</td>
          <td>${hours}h ${minutes}m</td>
          <td>${entry.jobId}</td>
        </tr>
        `;
      }).join('')}
    </tbody>
  </table>
  ` : '<p>Brak wpisów w tym okresie.</p>'}
</body>
</html>
  `;
}

/**
 * Export estimate to PDF
 * @param {Object} estimateData - Estimate data
 * @param {string} filename - Name of the PDF file
 */
export async function exportEstimateToPDF(estimateData, filename = 'oferta.pdf') {
  const htmlContent = generateEstimateHTML(estimateData);
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}

/**
 * Generate HTML content for estimate
 * @param {Object} estimateData - Estimate data
 * @returns {string} HTML content
 */
function generateEstimateHTML(estimateData) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Oferta ${estimateData.id}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      color: #333;
      border-bottom: 2px solid #1173d4;
      padding-bottom: 10px;
    }
    .header {
      margin-bottom: 30px;
    }
    .client-info {
      margin: 20px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #1173d4;
      color: white;
    }
    .total {
      text-align: right;
      font-weight: bold;
      font-size: 18px;
      margin-top: 20px;
    }
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Oferta #${estimateData.id}</h1>
    <p><strong>Data:</strong> ${estimateData.createdAt || new Date().toLocaleDateString('pl-PL')}</p>
    <p><strong>Wygasa:</strong> ${estimateData.dueDate || 'N/A'}</p>
  </div>

  <div class="client-info">
    <h2>Klient</h2>
    <p><strong>${estimateData.clientName || 'N/A'}</strong></p>
  </div>

  <table>
    <thead>
      <tr>
        <th>Opis</th>
        <th>Ilość</th>
        <th>Cena</th>
        <th>Wartość</th>
      </tr>
    </thead>
    <tbody>
      ${estimateData.items && estimateData.items.length > 0 ? estimateData.items.map(item => `
        <tr>
          <td>${item.description || ''}</td>
          <td>${item.quantity || 0}</td>
          <td>${item.rate || 0} zł</td>
          <td>${item.total || 0} zł</td>
        </tr>
      `).join('') : '<tr><td colspan="4">Brak pozycji</td></tr>'}
    </tbody>
  </table>

  <div class="total">
    <p>Netto: ${estimateData.subtotal || 0} zł</p>
    <p>VAT (${estimateData.taxRate || 23}%): ${estimateData.tax || 0} zł</p>
    <p>Brutto: ${estimateData.total || 0} zł</p>
  </div>

  ${estimateData.notes ? `
  <div style="margin-top: 30px;">
    <h3>Uwagi</h3>
    <p>${estimateData.notes}</p>
  </div>
  ` : ''}
</body>
</html>
  `;
}
