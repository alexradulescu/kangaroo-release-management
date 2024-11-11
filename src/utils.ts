import dayjs from 'dayjs'

import { ENV } from './config/env'

export function getNextReleaseDate(): Date {
  const today = dayjs()
  const dayOfWeek = today.day()

  if (dayOfWeek <= 3) {
    return today.add(1, 'day').toDate()
  } else {
    const daysUntilMonday = (8 - dayOfWeek) % 7
    return today.add(daysUntilMonday, 'day').toDate()
  }
}

export function formatDate(date: Date): string {
  return dayjs(date).format('DD MMM YYYY')
}

export function isValidVersion(version: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(version)
}

export function isValidJsmops(jsmopsNumber: string): boolean {
  return /^\d+$/.test(jsmopsNumber)
}

export function getJsmopsUrl(jsmopsNumber: string): string {
  return isValidJsmops(jsmopsNumber) ? `${ENV.JSMOPS_URL_PREFIX}${jsmopsNumber}` : ''
}
