/**
 * BizHubGY Loan Readiness Wizard — Email Collection Webhook
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://sheets.new and create a sheet called "BizHubGY Wizard Signups"
 * 2. Name the first sheet (tab) "Signups"
 * 3. Go to Extensions > Apps Script
 * 4. Delete any existing code and paste this entire file
 * 5. Click Deploy > New Deployment
 * 6. Choose type: "Web app"
 * 7. Execute as: "Me"
 * 8. Who has access: "Anyone" (the wizard uses no-cors, so this is fine)
 * 9. Click Deploy and copy the Web App URL
 * 10. Paste that URL into the wizard's WEBHOOK_URL constant (in index.html)
 * 
 * The sheet will auto-create these columns on first use:
 * Timestamp | Email | Source | Signed Up At | User Agent | Referrer
 */

const SHEET_NAME = 'Signups';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Auto-create sheet + headers if missing
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp',
        'Email',
        'Source',
        'Signed Up At',
        'User Agent',
        'Referrer'
      ]);
    }
    
    sheet.appendRow([
      new Date().toISOString(),
      data.email || '',
      data.source || 'loan-readiness-wizard',
      data.signedUpAt || '',
      data.userAgent || '',
      data.referrer || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'BizHubGY signup webhook is running. POST email data here.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
