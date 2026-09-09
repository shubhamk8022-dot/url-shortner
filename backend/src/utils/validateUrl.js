const MAX_LENGTH = 2048;

const validateUrl = (value) => {
  if (value === undefined || value === null) {
    return {
      valid: false,
      message: "originalUrl is required.",
    };
  }

  if (typeof value !== "string") {
    return {
      valid: false,
      message: "only string value is allowed.",
    };
  }

  const originalUrl = value.trim();

  if (!originalUrl) {
    return { valid: false, message: "original url required." };
  }

  if (originalUrl.length > MAX_LENGTH) {
    return {
      valid: false,
      message: `original url must not exceed ${MAX_LENGTH} characters`,
    };
  }

  try {
    const parsedUrl = new URL(originalUrl);
    console.log(parsedUrl);
    
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return { valid: false, message: `only HTTP and HTTPS urls are allowed` };
    }
    return { valid: true, value: parsedUrl.toString() };
  } catch {
    return { valid: false, message: "invalid url" };
  }
};

module.exports = validateUrl;
