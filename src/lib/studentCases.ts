type UnknownRecord = Record<string, unknown>

export interface StudentCaseSeed {
  fullName: string
  email: string
  phone: string
  nationality: string
  targetCountry: string
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function findByKeys(value: unknown, keys: Set<string>): string | undefined {
  if (value === null || value === undefined) return undefined

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || undefined
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findByKeys(item, keys)
      if (found) return found
    }
    return undefined
  }

  if (typeof value === 'object') {
    for (const [rawKey, rawValue] of Object.entries(value as UnknownRecord)) {
      if (keys.has(normalizeKey(rawKey))) {
        const found = findByKeys(rawValue, new Set(['value']))
        if (found) return found
      }

      const nested = findByKeys(rawValue, keys)
      if (nested) return nested
    }
  }

  return undefined
}

export function extractStudentCaseSeed(data: unknown): StudentCaseSeed {
  const fullName =
    findByKeys(data, new Set(['fullname', 'name', 'studentname', 'contactname'])) ??
    'Unknown student'

  const email =
    findByKeys(data, new Set(['email', 'emailaddress', 'contactemail', 'workemail'])) ??
    'unknown@example.com'

  const phone =
    findByKeys(data, new Set(['phone', 'phonenumber', 'mobile', 'whatsapp', 'contactnumber'])) ??
    ''

  const nationality =
    findByKeys(data, new Set(['nationality', 'citizenship', 'countryofcitizenship'])) ?? ''

  const targetCountry =
    findByKeys(data, new Set(['targetcountry', 'destinationcountry', 'studycountry'])) ?? ''

  return {
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    nationality: nationality.trim(),
    targetCountry: targetCountry.trim(),
  }
}
