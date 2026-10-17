export const safeProductSlug = (value: string | undefined): string => {
  const slug = value?.toLowerCase() ?? '';
  return /^[a-z0-9-]{1,100}$/.test(slug) ? slug : 'custom-trip';
};

export const indianMobile = (value: string): string | null => {
  const digits = value.replace(/\D/g, '');
  const normalized = digits.length >= 10 ? digits.slice(-10) : '';
  return /^[6-9]\d{9}$/.test(normalized) ? normalized : null;
};

export const validEnquiryDate = (value: string, todayInIndia: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= todayInIndia;
