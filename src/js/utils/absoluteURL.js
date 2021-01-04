/**
 * Force URL to be absolute
 * @param {String} url
 */
export default function absoluteURL(url) {
  if (url.match(/^https?:\/\//)) {
    return url;
  }

  return `https://${url}`;
};
