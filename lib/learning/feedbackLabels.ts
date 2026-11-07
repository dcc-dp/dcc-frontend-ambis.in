const FRIENDLY_LABELS: Record<string, string> = {
  ADDS_NUM_DENOM_DIRECTLY: 'Pembilang dan penyebut jangan langsung dijumlahkan ya',
  WRONG_LCM: 'Cek lagi cara mencari KPK-nya',
  FAILS_TO_SIMPLIFY: 'Jawabanmu masih bisa disederhanakan',
  CROSS_MULTIPLY_AS_ADD: 'Kali silang dan penjumlahan itu beda, coba cek lagi',
  MISCONCEPTION_DETECTED: 'Ada langkah yang perlu dicek lagi',
  hint: 'Petunjuk dari Kak Ambis',
  guiding_question: 'Pertanyaan pemantik dari Kak Ambis',
  explanation: 'Yuk lihat penjelasannya',
};

export const GENERIC_FEEDBACK_LABEL = 'Ada langkah yang perlu dicek lagi';

export function friendlyFeedbackLabel(...keys: Array<string | null | undefined>): string {
  for (const key of keys) {
    if (key && FRIENDLY_LABELS[key]) return FRIENDLY_LABELS[key];
  }
  return GENERIC_FEEDBACK_LABEL;
}
