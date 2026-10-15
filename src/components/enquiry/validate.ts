export type EnquiryValues = {
  name: string;
  contact: string;
  suburb: string;
  message: string;
  service: string;
  area: string;
};

export type FieldName = "name" | "contact" | "suburb" | "message";
export type EnquiryErrors = Partial<Record<FieldName, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared by the browser (instant feedback) and the server action (the real check). */
export function validateEnquiry(v: Pick<EnquiryValues, FieldName>): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!v.name.trim()) errors.name = "Please add your name.";
  const contact = v.contact.trim();
  const digits = contact.replace(/\D/g, "");
  if (!contact) errors.contact = "Please add a phone number or email address.";
  else if (!EMAIL.test(contact) && digits.length < 9)
    errors.contact = "Please check this. Use a phone number or an email address.";
  if (!v.suburb.trim()) errors.suburb = "Please add your suburb.";
  if (!v.message.trim()) errors.message = "Please tell us briefly what needs attention.";
  return errors;
}
