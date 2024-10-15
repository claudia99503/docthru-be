export const formatDate = (date) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .format(new Date(date))
    .replace(/\. /g, '-')
    .replace(/:/g, '시')
    .replace(/^(\d{4})-(\d{2})-(\d{2})/, '$1년 $2월 $3일');
};
