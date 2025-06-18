export function isIntegerString(value: string): boolean {
  const num = Number(value);
  return Number.isInteger(num) && value.trim() !== '';
}
