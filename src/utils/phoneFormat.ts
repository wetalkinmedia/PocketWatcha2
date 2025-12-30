export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  } else {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
}
