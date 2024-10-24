import dayjs from 'dayjs';

export function getNextReleaseDate(): Date {
  const today = dayjs();
  const dayOfWeek = today.day(); // 0 is Sunday, 6 is Saturday

  if (dayOfWeek <= 3) { // Monday (1) to Wednesday (3)
    return today.add(1, 'day').toDate();
  } else { // Thursday (4) to Sunday (0)
    const daysUntilMonday = (8 - dayOfWeek) % 7;
    return today.add(daysUntilMonday, 'day').toDate();
  }
}

export function formatDate(date: Date): string {
  return dayjs(date).format('DD MMM YYYY');
}