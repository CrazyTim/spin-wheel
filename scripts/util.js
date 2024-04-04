/**
 * Format a date
 * Example: `dateFormat (new Date (), "%Y-%m-%d %H:%M:%S")`
 * will return "2012-05-18 05:37:21".
 */
export function dateFormat(date, format, utc = true) {
  utc = utc ? "getUTC" : "get";
  return format.replace(/%[YmdHMS]/g, (i) => {
    if (i === "%Y")
      return date[utc + "FullYear"](); // no leading zeros required
    else if (i === "%m") i = 1 + date[utc + "Month"]();
    else if (i === "%d") i = date[utc + "Date"]();
    else if (i === "%H") i = date[utc + "Hours"]();
    else if (i === "%M") i = date[utc + "Minutes"]();
    else if (i === "%S") i = date[utc + "Seconds"]();
    else return i.slice(1); // unknown code, remove %

    // add leading zero if required
    return ("0" + i).slice(-2);
  });
}

export async function loadFonts(fontNames = []) {
  // Fail silently if browser doesn't support font loading.
  if (!("fonts" in document)) return;

  const fontLoading = [];

  for (const i of fontNames) {
    if (typeof i === "string")
      fontLoading.push(document.fonts.load("1em " + i));
  }

  await Promise.all(fontLoading);
}

/**
 * Return an array of getters and setters on the instance
 */
export function getInstanceProperties(instance) {
  return {
    getters: Object.entries(
      Object.getOwnPropertyDescriptors(Reflect.getPrototypeOf(instance)),
    )
      .filter((e) => typeof e[1]["get"] === "function" && e[0] !== "__proto__")
      .map((e) => e[0]),

    setters: Object.entries(
      Object.getOwnPropertyDescriptors(Reflect.getPrototypeOf(instance)),
    )
      .filter((e) => typeof e[1]["set"] === "function" && e[0] !== "__proto__")
      .map((e) => e[0]),
  };
}

/**
 * Wrapper for `setTimeout` that can be awaited.
 * Resolve after a certain duration (in milliseconds).
 */
export async function delay(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
