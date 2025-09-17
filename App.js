
function getNewestSheet(){
  const spreadSheets = SpreadsheetApp.getActiveSpreadsheet()
  const sheets = spreadSheets.getSheets();
  return sheets[sheets.length - 1];
}

// Log a completed sequence into the sheet
function completeRow(name, sequence, priceSum) {
  const sheet = getNewestSheet();
  let lastRow = sheet.getLastRow();

  const row = lastRow +1

  sheet.getRange(row, 1).insertCheckboxes();
  sheet.getRange(row, 2).setValue(name);       // Column B = Name
  sheet.getRange(row, 3).setValue(new Date().toLocaleTimeString()); // Column C = Timestamp
  sheet.getRange(row, 4).setValue(sequence);   // Column D = Sequence
  sheet.getRange(row, 5).setValue(priceSum.toString());
  sheet.getRange(row, 6).insertCheckboxes();
  
  
}

// Show the sidebar
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile("Page")
    .setTitle("Logger");
  SpreadsheetApp.getUi().showSidebar(html);
}

function doGet(e) {
  if (e.parameter.page === "cup") {
    return HtmlService.createHtmlOutputFromFile("cupMaker");
  } else { 
    return HtmlService.createHtmlOutputFromFile("Page")
        .setTitle("Sequence Logger")
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

// Add menu to open sidebar
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Logger")
    .addItem("Open Buttons", "showSidebar")
    .addToUi();
}

function getPendingOrders() {
  const sheet = getNewestSheet();
  const data = sheet.getDataRange().getValues();
  const pending = [];

  for (let i = 3; i < data.length; i++) { 
    const completed = data[i][0]; // Col A
    const name = data[i][1];      // Col B
    const time = data[i][2];      // Col C
    const order = data[i][3];     // Col D
    const cupDone = data[i][5];   // Col F

    // Skip empty rows or rows with missing name/order
    if (!name || !order) continue;

    if (!completed && !cupDone) {
      let timeStr = time instanceof Date 
                    ? Utilities.formatDate(time, Session.getScriptTimeZone(), "hh:mm a") 
                    : time;
      pending.push([i + 1, name, timeStr, order]);
    }
  }

  console.log(pending);
  return pending;
}

function markCupDone(row) {
  const sheet = getNewestSheet();
  sheet.getRange(row, 6).setValue(true); // col E = Cup Done
}

