/**
 * Normalizar número de telefone para formato E.164
 * Exemplo: "(21) 98765-4321" → "+5521987654321"
 */
export function normalizePhone(phone: string): string {
  if (!phone) return null;

  // Remover caracteres especiais
  let cleaned = phone.replace(/\D/g, '');

  // Se começar com 0, remover
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // Se não tiver código de país (55 para Brasil), adicionar
  if (!cleaned.startsWith('55')) {
    cleaned = '55' + cleaned;
  }

  // Validar tamanho (55 + 2 dígitos DDD + 8 ou 9 dígitos número)
  if (cleaned.length < 12 || cleaned.length > 13) {
    return null;
  }

  return '+' + cleaned;
}

/**
 * Validar se telefone é válido (já normalizado)
 */
export function isValidPhone(phoneE164: string): boolean {
  if (!phoneE164) return false;

  // Deve começar com +
  if (!phoneE164.startsWith('+')) return false;

  // Deve ter 12-13 dígitos (+ 55 + ddd + número)
  if (phoneE164.length < 12 || phoneE164.length > 14) return false;

  return true;
}

/**
 * Formatar telefone E.164 para exibição
 * Exemplo: "+5521987654321" → "(21) 98765-4321"
 */
export function formatPhone(phoneE164: string): string {
  if (!phoneE164) return null;

  const cleaned = phoneE164.replace(/\D/g, '');

  if (cleaned.length === 12) {
    // Sem nono dígito: (XX) XXXX-XXXX
    return `(${cleaned.substring(2, 4)}) ${cleaned.substring(4, 8)}-${cleaned.substring(8)}`;
  }

  if (cleaned.length === 13) {
    // Com nono dígito: (XX) 9XXXX-XXXX
    return `(${cleaned.substring(2, 4)}) ${cleaned.substring(4, 9)}-${cleaned.substring(9)}`;
  }

  return phoneE164;
}
