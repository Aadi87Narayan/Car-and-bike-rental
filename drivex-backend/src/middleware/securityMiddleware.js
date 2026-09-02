/**
 * Sanitize object key names to prevent NoSQL injection (removes keys starting with $ or containing .)
 */
function sanitizeNoSQL(obj) {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitizeNoSQL(obj[key]);
      }
    }
  }
  return obj;
}

/**
 * Basic XSS sanitizer to strip HTML tags from string values
 */
function sanitizeXSS(value) {
  if (typeof value === 'string') {
    // Strip common HTML tags
    return value.replace(/<[^>]*>/g, '').trim();
  }
  if (value && typeof value === 'object') {
    for (const key in value) {
      value[key] = sanitizeXSS(value[key]);
    }
  }
  return value;
}

export function securitySanitizer(req, res, next) {
  if (req.body) {
    req.body = sanitizeNoSQL(req.body);
    req.body = sanitizeXSS(req.body);
  }
  if (req.query) {
    req.query = sanitizeNoSQL(req.query);
    req.query = sanitizeXSS(req.query);
  }
  if (req.params) {
    req.params = sanitizeNoSQL(req.params);
    req.params = sanitizeXSS(req.params);
  }
  next();
}
