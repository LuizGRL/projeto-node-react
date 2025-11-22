export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;

  email = email.trim();

  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [local, domain] = parts;

  if (!local) return false;
  if (!domain) return false;

  const localPartRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
  if (!localPartRegex.test(local)) return false;

  if (!domain.includes(".")) return false;

  if (/^[-.]/.test(domain) || /[-.]$/.test(domain)) return false;

  const domainParts = domain.split(".");
  if (domainParts.length < 2) return false;

  const domainPartRegex = /^[a-zA-Z0-9-]+$/;

  for (const part of domainParts) {
    if (!part || !domainPartRegex.test(part)) return false;

    if (/^-/.test(part) || /-$/.test(part)) return false;
  }

  return true;
}
