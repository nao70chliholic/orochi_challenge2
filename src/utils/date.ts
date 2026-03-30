export const getStartOfTodayJST = (): Date => {
  const now = new Date();
  const jstFormatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  const parts = jstFormatter.formatToParts(now);
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  
  // ISO 8601フォーマットでJSTの深夜0時を作成（UTCに正しく変換される）
  return new Date(`${year}-${month}-${day}T00:00:00+09:00`);
};
