export function isMemberExpired(memberNumber: string, createdAt: Date): boolean {
  const currentYear = new Date().getFullYear();
  let issueYear = createdAt.getFullYear();
  
  // Try to extract year from memberNumber (e.g. MEM/2026/00012)
  const match = memberNumber.match(/\b(202\d)\b/);
  if (match) {
    issueYear = parseInt(match[1], 10);
  }

  // Expires on Jan 1st of the next year.
  // Meaning if currentYear > issueYear, it's expired.
  return currentYear > issueYear;
}

export function isMemberEffectivelyValid(member: { isValid: boolean, memberNumber: string, createdAt: Date }): boolean {
  const isExpired = isMemberExpired(member.memberNumber, member.createdAt);
  return member.isValid && !isExpired;
}
