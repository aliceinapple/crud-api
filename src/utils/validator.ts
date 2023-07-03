export function errorHandler(err: unknown) {
  console.error(err);
}

export function isValidUUID(userId: string): boolean {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(userId);
}
