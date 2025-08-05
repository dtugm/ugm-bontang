export function applyMapping(
  obj: Record<string, any>,
  mappings: Record<string, Record<string, string>>
) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      mappings[key]?.[value] ?? value,
    ])
  );
}
