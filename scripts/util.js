/**
 * Format a date
 * Example: `dateFormat (new Date (), "%Y-%m-%d %H:%M:%S")`
 * will return "2012-05-18 05:37:21".
 */
export function dateFormat (date, format, utc = true) {
  utc = utc ? 'getUTC' : 'get';
  return format.replace (/%[YmdHMS]/g, i => {
    switch (i) {
      case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
      case '%m': i = 1 + date[utc + 'Month'] (); break;
      case '%d': i = date[utc + 'Date'] (); break;
      case '%H': i = date[utc + 'Hours'] (); break;
      case '%M': i = date[utc + 'Minutes'] (); break;
      case '%S': i = date[utc + 'Seconds'] (); break;
      default: return i.slice (1); // unknown code, remove %
    }
    // add leading zero if required
    return ('0' + i).slice (-2);
  });
}

export async function loadFonts(fontNames = []) {
  // Fail silently if browser doesn't support font loading.
  if (!'fonts' in document) return;

  const fontLoading = [];
  for (const i of fontNames) {
    if (typeof i === 'string') fontLoading.push(document.fonts.load('1em ' + i));
  }

  await Promise.all(fontLoading);
}

/**
 * Return an array of getters and setters on the instance
 */
export function getInstanceProperties (instance) {
  return {
    getters:
      Object.entries(
        Object.getOwnPropertyDescriptors(
          Reflect.getPrototypeOf(instance)
        )
      )
      .filter(e => typeof e[1]['get'] === 'function' && e[0] !== '__proto__')
      .map(e => e[0]),

    setters:
      Object.entries(
        Object.getOwnPropertyDescriptors(
          Reflect.getPrototypeOf(instance)
        )
      )
      .filter(e => typeof e[1]['set'] === 'function' && e[0] !== '__proto__')
      .map(e => e[0]),
  }
}
