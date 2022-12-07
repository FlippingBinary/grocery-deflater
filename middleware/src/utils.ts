export type recordId = {
  scope: 'location' | 'product' | 'variant' | 'category' | 'list'
  id: number
}

export function encodeId(recordId: recordId): string {
  return Buffer.from(recordId.scope + ':' + recordId.id.toString()).toString(
    'base64'
  )
}

export function decodeId(encodedId: string): recordId | null {
  const [scope, stringId] = Buffer.from(encodedId, 'base64')
    .toString('ascii')
    .split(':')
  const id = parseInt(stringId)
  if (scope === undefined || isNaN(id)) return null
  if (
    scope !== 'location' &&
    scope !== 'product' &&
    scope !== 'variant' &&
    scope !== 'category' &&
    scope !== 'list'
  )
    return null
  return { scope, id }
}
