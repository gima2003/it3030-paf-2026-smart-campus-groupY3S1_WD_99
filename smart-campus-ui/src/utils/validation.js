export const validateName = (name) => {
  if (!name || name.trim() === "") return "Required";
  const trimmed = name.trim();
  if (/[0-9]/.test(trimmed)) return "Numbers are not allowed";
  if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) return "Only letters, spaces, hyphens, and apostrophes allowed";
  return "";
};

export const validateEmail = (email) => {
  if (!email || email.trim() === "") return "Required";
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return "Invalid email format";
  if (trimmed.length < 5 || trimmed.split('@')[1].length < 3) return "Domain is suspicious or invalid";
  return "";
};

export const validatePhone = (phone) => {
  if (!phone || phone.trim() === "") return "Required";
  const trimmed = phone.trim();
  if (!/^\d+$/.test(trimmed)) return "Only numbers are allowed";
  if (trimmed.length < 9 || trimmed.length > 15) return "Must be between 9 and 15 digits";
  if (/^(\d)\1{5,}$/.test(trimmed)) return "Invalid phone number pattern";
  return "";
};

export const validateCity = (city) => {
  if (!city || city.trim() === "") return "Required";
  const trimmed = city.trim();
  if (/^\d+$/.test(trimmed)) return "City cannot be only numbers";
  if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) return "Only letters, spaces, hyphens, and apostrophes allowed";
  return "";
};

export const validateStudentId = (id) => {
  if (!id || id.trim() === "") return "Required";
  const trimmed = id.trim();
  if (!/^(IT|it)\d{8}$/.test(trimmed)) return "Format: IT12345678";
  return "";
};

export const validateEmployeeId = (id) => {
  if (!id || id.trim() === "") return "Required";
  const trimmed = id.trim();
  if (!/^(EMP|emp)\d{5}$/.test(trimmed)) return "Format: EMP12345";
  return "";
};

export const validateRequired = (value) => {
  if (!value || String(value).trim() === "") return "Required";
  return "";
};
