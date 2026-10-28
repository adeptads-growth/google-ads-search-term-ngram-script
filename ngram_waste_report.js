/**
 * N-Gram Waste Report - Google Ads Script
 * Maintained by AdeptAds (https://www.adeptads.ai)
 *
 * Reads the last 30 days of search terms, builds 1-3 word n-grams
 * with aggregated cost, clicks and conversions, and writes a sheet
 * ranking n-grams by spend with zero conversions, for negative-keyword review.
 *
 * Setup:
 * 1. In Google Ads, go to Tools & Settings > Bulk Actions > Scripts.
 * 2. Create a new script, paste this code.
 * 3. Set SPREADSHEET_URL below to a blank Google Sheet you own (must be editable).
 * 4. Authorize the script and run it. Schedule it to run daily/weekly.
 *
 * Limits:
 * - Uses the standard 30-day SEARCH_QUERY_PERFORMANCE_REPORT; very large
 *   accounts may need to split by campaign to avoid script time limits.
 * - N-grams are generated from whitespace-split tokens; exact match terms
 *   with unusual punctuation may be under-tokenized.
 * - This script only reports; it does not add negative keywords automatically.
 */

var SPREADSHEET_URL = 'PASTE_YOUR_GOOGLE_SHEET_URL_HERE';
var DAYS_LOOKBACK = 30;
var MAX_NGRAM_SIZE = 3;

function main() {
  if (SPREADSHEET_URL.indexOf('PASTE_YOUR') !== -1) {
    throw new Error('Set SPREADSHEET_URL to a Google Sheet URL before running.');
  }

  var ngramStats = {};
  var query =
    'SELECT SearchTerm, Cost, Clicks, Conversions ' +
    'FROM SEARCH_QUERY_PERFORMANCE_REPORT ' +
    'DURING LAST_' + DAYS_LOOKBACK + '_DAYS';

  var rows = AdsApp.report(query).rows();
  while (rows.hasNext()) {
    var row = rows.next();
    var term = (row['SearchTerm'] || '').toLowerCase();
    var cost = parseFloat(row['Cost']) || 0;
    var clicks = parseFloat(row['Clicks']) || 0;
    var conversions = parseFloat(row['Conversions']) || 0;

    var tokens = term.split(/\s+/).filter(function (t) { return t.length > 0; });
    for (var n = 1; n <= MAX_NGRAM_SIZE; n++) {
      for (var i = 0; i + n <= tokens.length; i++) {
        var gram = tokens.slice(i, i + n).join(' ');
        if (!ngramStats[gram]) {
          ngramStats[gram] = { ngram: gram, cost: 0, clicks: 0, conversions: 0 };
        }
        ngramStats[gram].cost += cost;
        ngramStats[gram].clicks += clicks;
        ngramStats[gram].conversions += conversions;
      }
    }
  }

  var wasteList = [];
  for (var key in ngramStats) {
    var s = ngramStats[key];
    if (s.conversions === 0 && s.cost > 0) {
      wasteList.push(s);
    }
  }
  wasteList.sort(function (a, b) { return b.cost - a.cost; });

  writeToSheet(wasteList);
  Logger.log('Wrote ' + wasteList.length + ' zero-conversion n-grams to the sheet.');
}

function writeToSheet(wasteList) {
  var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var sheet = ss.getSheetByName('NgramWaste') || ss.insertSheet('NgramWaste');
  sheet.clear();
  sheet.appendRow(['N-Gram', 'Cost', 'Clicks', 'Conversions']);

  for (var i = 0; i < wasteList.length; i++) {
    var s = wasteList[i];
    sheet.appendRow([s.ngram, s.cost, s.clicks, s.conversions]);
  }
}
