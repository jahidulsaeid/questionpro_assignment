export type FormFieldType = "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "date";

export interface FormField {
  id: string;
  label: string;
  name: string;
  type: FormFieldType;
  required: boolean;
  options: string[];
}
