import { differenceInDays, parseISO, startOfDay } from 'date-fns';

export const deadline = (deadlineStr: string) => {
  const deadlineDate =
    typeof deadlineStr === 'string'
      ? parseISO(deadlineStr)
      : new Date(deadlineStr);
  const days = differenceInDays(
    startOfDay(deadlineDate),
    startOfDay(new Date()),
  );
  if (days < 0) {
    return '마감';
  }
  if (days === 0) {
    return 'D-Day';
  }
  return `D-${days}`;
};
