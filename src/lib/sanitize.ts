import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes plain text input by stripping all HTML tags.
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

/**
 * Sanitizes rich text input (such as blog post body) keeping safe formatting tags.
 */
export function sanitizeRichText(input: string): string {
  if (!input) return "";
  return sanitizeHtml(input, {
    allowedTags: [
      "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
      "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
      "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
      "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
      "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
      "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "img"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
    },
    selfClosing: ["img", "br", "hr", "area", "base", "basefont", "input", "link", "meta"],
    allowedSchemes: ["http", "https", "ftp", "mailto", "tel"],
  });
}
