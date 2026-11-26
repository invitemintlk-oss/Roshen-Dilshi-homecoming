// RSVP receiver for the Roshen & Dilshi homecoming site.
// Paste this into Extensions > Apps Script of the RSVP spreadsheet, then deploy as a web app
// (see google-apps-script/README.md).

const SPREADSHEET_ID = "1rvWUK_YigUaYWHW3VcvV6hj_JPaB9k-5r6T6Ot9JrMA";
const SHEET_NAME = "RSVP";
const HEADERS = ["Timestamp", "Name", "Mobile", "Attending", "Guests", "Invited As"];
const HEADER_BG = "#33401E";

// Creates the RSVP tab with styled headers. Safe to run more than once.
function setup() {
  getSheet_();
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const name = String(data.name || "").trim().slice(0, 120);
    const attending = data.attending === "yes" ? "Yes" : data.attending === "no" ? "No" : "";
    if (!name || !attending) return json_({ ok: false, error: "Name and attendance are required." });

    const guests = attending === "Yes" ? Math.min(Math.max(parseInt(data.guests, 10) || 1, 1), 20) : 0;
    const invitedAs = String(data.invitedAs || "").trim().slice(0, 120);
    // Leading apostrophe keeps the sheet from dropping the 0 in 07X numbers
    const phone = String(data.phone || "").replace(/[^\d+ ]/g, "").trim().slice(0, 20);

    getSheet_().appendRow([new Date(), name, phone ? "'" + phone : "", attending, guests, invitedAs]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, message: "RSVP endpoint is running." });
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
      .setFontWeight("bold").setBackground(HEADER_BG).setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.getRange("A:A").setNumberFormat("dd MMM yyyy, hh:mm a");
    sheet.setColumnWidths(1, HEADERS.length, 170);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
