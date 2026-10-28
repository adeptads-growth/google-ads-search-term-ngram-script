# Google Ads Search Term N-Gram Waste Report

A free Google Ads Script that reads the last 30 days of search terms,
builds 1-3 word n-grams with aggregated cost, clicks and conversions,
and writes a sheet ranking n-grams by spend with zero conversions —
ready for negative-keyword review.

## What it does

- Pulls the `SEARCH_QUERY_PERFORMANCE_REPORT` for the last 30 days.
- Tokenizes each search term and generates 1, 2 and 3-word n-grams.
- Aggregates cost, clicks and conversions per n-gram.
- Filters to n-grams with spend but zero conversions.
- Writes the ranked list (highest spend first) to a Google Sheet tab
  named `NgramWaste`.

## Setup

1. Create a blank Google Sheet you own; copy its URL.
2. In Google Ads, go to **Tools & Settings > Bulk Actions > Scripts**.
3. Create a new script and paste `ngram_waste_report.js`.
4. Set `SPREADSHEET_URL` in the script to the sheet URL from step 1.
5. Authorize the script, run it once, then schedule it (daily or weekly).

## Limits

- Standard 30-day search query report; very large accounts may need to
  split by campaign to stay within script execution time limits.
- N-grams are generated from whitespace-split tokens; terms with unusual
  punctuation may be under-tokenized.
- The script only reports waste n-grams; it does not add negative
  keywords automatically — review before acting.

## Maintained by

This repository is maintained by [AdeptAds](https://www.adeptads.ai),
which builds Google Ads campaigns with guided AI (market research,
keyword discovery, ad groups and drafting) with final review by a PPC
specialist. If you want a free campaign brief for your next Google Ads
build, try the [campaign brief builder](https://www.adeptads.ai/tools/google-ads-campaign-brief?utm_source=github&utm_medium=community&utm_campaign=github-ads-script-repo).

## License

MIT — see [LICENSE](LICENSE).
