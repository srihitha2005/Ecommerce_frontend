// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 8 chars, at least one letter and one number)
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
};

// Phone number validation (Indian format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// GST number validation
export const isValidGST = (gst: string): boolean => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

// Name validation (letters and spaces only)
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[A-Za-z\s]+$/.test(name);
};

// Price validation
export const isValidPrice = (price: number): boolean => {
  return price > 0 && isFinite(price);
};

// Quantity validation
export const isValidQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity > 0;
};

// URL validation
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Get validation error message
export const getValidationError = (field: string, value: any): string | null => {
  switch (field) {
    case 'email':
      return !isValidEmail(value) ? 'Please enter a valid email address' : null;
    case 'password':
      return !isValidPassword(value) 
        ? 'Password must be at least 8 characters with letters and numbers' 
        : null;
    case 'phone':
      return !isValidPhone(value) ? 'Please enter a valid 10-digit phone number' : null;
    case 'gst':
      return !isValidGST(value) ? 'Please enter a valid GST number' : null;
    case 'name':
      return !isValidName(value) ? 'Name must contain only letters and spaces' : null;
    case 'price':
      return !isValidPrice(value) ? 'Price must be a positive number' : null;
    case 'quantity':
      return !isValidQuantity(value) ? 'Quantity must be a positive integer' : null;
    default:
      return null;
  }
};