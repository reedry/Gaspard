const doGet = () => {
  const output = HtmlService.createHtmlOutputFromFile("index.html");
  return output.addMetaTag("viewport", "width=device-width, initial-scale=1");
};

export function getSheetNames(url: string): string[] {
  const ss = SpreadsheetApp.openByUrl(url);
  const sheets = ss.getSheets();
  return sheets.map(sheet => sheet.getName());
}

export function getTableFromSheet(url: string, name: string): string {
  const ss = SpreadsheetApp.openByUrl(url);
  const sheet = ss.getSheetByName(name) ?? ss.getSheets()[0];
  return JSON.stringify(
    sheet.getSheetValues(1, 1, sheet.getLastRow(), sheet.getLastColumn())
  );
}
