/**
 * Che mọi mốc thời gian trong văn bản cho tới khi người chơi xếp xong bảo tàng.
 *
 * Bảo tàng cố ý không tiết lộ niên đại: đoán ra mỗi phòng thuộc giai đoạn nào
 * chính là phần chơi. Nhưng mô tả hiện vật lại đầy ngày tháng, nên chỉ cần đọc
 * một mô tả là suy ra cả phòng. Hàm này thay chúng bằng "??" cho tới lúc hoàn
 * thành, rồi trả lại nguyên văn.
 *
 * Bắt theo thứ tự từ mẫu dài tới mẫu ngắn để "19/12/1946" không bị cắt rời
 * thành "19/12/??".
 */
const PATTERNS: RegExp[] = [
  // 19/12/1946 hoặc 2/9/1945
  /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g,
  // 12/1946
  /\b\d{1,2}\/\d{4}\b/g,
  // "ngày 2 tháng 9 năm 1945"
  /\bngày\s+\d{1,2}\s+tháng\s+\d{1,2}\s+năm\s+\d{4}\b/gi,
  // "tháng 2 năm 1951"
  /\btháng\s+\d{1,2}\s+năm\s+\d{4}\b/gi,
  // "năm 1947"
  /\bnăm\s+\d{4}\b/gi,
  // 1946 - 1950
  /\b\d{4}\s*-\s*\d{4}\b/g,
  // số năm đứng một mình
  /\b(?:19|20)\d{2}\b/g,
];

export function maskDates(text: string, reveal: boolean): string {
  if (reveal) return text;
  return PATTERNS.reduce((acc, re) => acc.replace(re, "??"), text);
}
