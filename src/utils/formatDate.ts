import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatDateToKoreanStyle = (date: string): string => {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  return format(d, 'yyyy년 M월 d일 EEEE a h시', { locale: ko });
};

export const formatDateToYYMMDD = (date: string): string => {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  return format(d, 'yy.MM.dd');
};
