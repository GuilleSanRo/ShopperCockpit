/**
 * DAT Group links used by the DAT TOOL card and its internal page.
 *
 * DAT blocks navigations to the My-DAT dashboard when they come from another
 * website: a link click reaches `/es-es/my-dat/dashboard/` with
 * `Sec-Fetch-Site: cross-site`, and DAT's edge answers `200` with a three-byte
 * `ccc` page instead of the app. A typed URL or a bookmark is not treated as
 * cross-site, so it loads normally.
 *
 * The DAT entry page has no such rule, so it is the reliable click target.
 */
export const DAT_ENTRY_URL = "https://www.datgroup.com/es-es/";
export const DAT_DASHBOARD_URL = "https://www.datgroup.com/es-es/my-dat/dashboard/";
