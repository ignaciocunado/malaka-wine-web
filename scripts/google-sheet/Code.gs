/**
 * Receives sign-ups from the "register your interest" form and adds them to this Google Sheet.
 *
 * Set-up (see the README): create a Google Sheet, open Extensions → Apps Script, paste this file, then
 * Deploy → New deployment → Web app, "Execute as: Me", "Who has access: Anyone". Copy the web app URL (it ends
 * in /exec) into INTEREST_ENDPOINT in src/lib/site.ts. After editing this script, deploy a new version
 * (Deploy → Manage deployments → Edit → New version) or the old code keeps running.
 */

var HEADERS = ["Signed up (UTC)", "Email", "Language", "Plan of interest", "Privacy policy version"];
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function doPost(e) {
  var params = (e && e.parameter) || {};
  var email = String(params.email || "").trim().toLowerCase();
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return reply(false);

  // Only known values are stored, so nobody can write arbitrary text into the sheet.
  var lang = params.lang === "en" ? "en" : "es";
  var plan = /^[A-Z_]{1,30}$/.test(params.plan || "") ? params.plan : "";
  var policy = /^\d{4}-\d{2}-\d{2}$/.test(params.policy || "") ? params.policy : "";

  // One sign-up at a time, so two people at once can't both pass the duplicate check.
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    var rows = sheet.getLastRow() - 1;
    var known = rows > 0 ? sheet.getRange(2, 2, rows, 1).getValues() : [];
    var already = known.some(function (row) {
      return String(row[0]).replace(/^'/, "") === email;
    });
    // Someone signing up twice gets the same answer, so the form doesn't reveal who is on the list.
    if (!already) sheet.appendRow([new Date().toISOString(), plainText(email), lang, plan, policy]);
  } finally {
    lock.releaseLock();
  }
  return reply(true);
}

/** Stops Sheets from reading a value that starts with =, +, - or @ as a formula. */
function plainText(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function reply(ok) {
  return ContentService.createTextOutput(JSON.stringify({ ok: ok })).setMimeType(ContentService.MimeType.JSON);
}
