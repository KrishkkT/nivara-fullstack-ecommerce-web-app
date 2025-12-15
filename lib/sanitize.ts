// Simple input sanitization to prevent XSS attacks
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Sanitize form data
export function sanitizeFormData(formData: FormData): Record<string, string> {
  const sanitized: Record<string, string> = {}
  
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value)
    } else {
      sanitized[key] = ''
    }
  }
  
  return sanitized
}

// Validate and sanitize email
export function validateAndSanitizeEmail(email: string): string | null {
  if (typeof email !== 'string') return null
  
  const sanitized = sanitizeInput(email.trim())
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(sanitized)) {
    return null
  }
  
  return sanitized
}

// Validate phone number
export function validatePhoneNumber(phone: string): string | null {
  if (typeof phone !== 'string') return null
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '')
  
  // Indian phone numbers are 10 digits
  if (digitsOnly.length === 10) {
    return digitsOnly
  }
  
  // International format with country code
  if (digitsOnly.length > 10 && digitsOnly.length <= 15) {
    return digitsOnly
  }
  
  return null
}