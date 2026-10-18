/** Error boundaries are eager client entries: keep their copy independent of full page dictionaries. */
export const ERROR_COPY = {
  en: { title: 'Something went wrong', body: 'Something went wrong on our side. Please try again.', retry: 'Try again' },
  hi: { title: 'कुछ गड़बड़ हो गई', body: 'हमारी तरफ़ से कुछ गड़बड़ हुई। कृपया फिर से कोशिश करें।', retry: 'फिर से कोशिश करें' },
} as const;
