import type { AgentFeedback } from './types';

export function buildServiceFallback(isCorrect: boolean): AgentFeedback {
  return {
    is_correct: isCorrect,
    error_type: isCorrect ? null : 'conceptual',
    misconception_code: null,
    intervention: isCorrect ? null : {
      kind: 'hint',
      rule_code: 'HINT_FALLBACK',
      reason: 'Periksa kembali langkah pengerjaanmu.',
      text: 'Periksa kembali perhitunganmu ya. Samakan dulu penyebutnya sebelum dijumlahkan!',
    },
    mastery: isCorrect ? 0.75 : 0.25,
  };
}

export function buildOfflineFallback(isCorrect: boolean): AgentFeedback {
  return {
    is_correct: isCorrect,
    error_type: isCorrect ? null : 'calculation',
    misconception_code: null,
    intervention: isCorrect ? null : {
      kind: 'hint',
      rule_code: 'OFFLINE_HINT',
      reason: 'Coba hitung ulang dengan teliti.',
      text: 'Jangan menyerah! Coba periksa kembali langkah menyamakan penyebut ya.',
    },
    mastery: isCorrect ? 0.7 : 0.3,
  };
}

export function getMisconceptionExplanation(code: string): string {
  switch (code) {
    case 'ADDS_NUM_DENOM_DIRECTLY':
      return 'Cenderung menjumlahkan pembilang dan penyebut secara langsung (contoh: 1/2 + 1/3 = 2/5). Kita perlu memperkuat fondasi penyamaan penyebut dengan KPK.';
    case 'WRONG_LCM':
      return 'Keliru dalam mencari Kelipatan Persekutuan Terkecil (KPK) untuk menyamakan penyebut.';
    case 'FAILS_TO_SIMPLIFY':
      return 'Perhitungan sudah tepat namun belum menyederhanakan pecahan ke bentuk paling sederhana.';
    case 'CROSS_MULTIPLY_AS_ADD':
      return 'Tertukar antara operasi perkalian silang dan penjumlahan pecahan.';
    default:
      return 'Perlu penguatan langkah-langkah dasar operasi pecahan.';
  }
}
