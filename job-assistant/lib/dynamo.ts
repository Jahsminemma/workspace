export function table(name: string) {
  if (!name) throw new Error('Missing table name');
  return name;
}

export async function notImplemented(op: string) {
  return { ok: false, op, message: 'Dynamo integration not implemented yet' };
}
