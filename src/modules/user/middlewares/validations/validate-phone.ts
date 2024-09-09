export const validatePhone = (phone: string): boolean => {
  if (phone.length === 11) return true;

  return false;
};
