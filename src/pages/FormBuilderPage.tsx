import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FORM_FIELDS_STORAGE_KEY } from "../constants/storageKeys";
import { loadFromStorage, saveToStorage } from "../lib/localStorage";
import type { FormField, FormFieldType as FieldType } from "../types/form";
import styles from "./FormBuilderPage.module.css";

const fieldTypeOptions: Array<{ label: string; value: FieldType }> = [
  { label: "Input (text)", value: "text" },
  { label: "Textarea", value: "textarea" },
  { label: "Number", value: "number" },
  { label: "Dropdown (select)", value: "select" },
  { label: "Date", value: "date" },
  { label: "Checkbox", value: "checkbox" },
];

function normalizeName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function createField(): FormField {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  return {
    id,
    label: "New Field",
    name: `field_${id.slice(0, 6)}`,
    type: "text",
    required: false,
    options: [],
  };
}

function FormBuilderPage() {
  const [fields, setFields] = useState<FormField[]>(() => loadFromStorage<FormField[]>(FORM_FIELDS_STORAGE_KEY, []));
  const [selectOptionsDrafts, setSelectOptionsDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    saveToStorage(FORM_FIELDS_STORAGE_KEY, fields);
  }, [fields]);

  function addField() {
    setFields((prev) => [...prev, createField()]);
  }

  function updateField(id: string, update: Partial<FormField>) {
    setFields((prev) => prev.map((field) => (field.id === id ? { ...field, ...update } : field)));
  }

  function removeField(id: string) {
    setFields((prev) => prev.filter((field) => field.id !== id));
    setSelectOptionsDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  return (
    <section className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.heading}>Dynamic Form Builder</h2>
        </div>
        <button type="button" onClick={addField} className={styles.primaryButton}>
          Add field
        </button>
      </div>

      {fields.length === 0 && <p className={styles.emptyState}>No fields yet. Click Add field to start.</p>}

      <div className={styles.fields}>
        {fields.map((field, index) => (
          <article key={field.id} className={styles.fieldCard}>
            <div className={styles.cardHeader}>
              <h3>Field {index + 1}</h3>
              <button type="button" className={styles.dangerButton} onClick={() => removeField(field.id)}>
                Remove
              </button>
            </div>

            <div className={styles.grid}>
              <label>
                Label
                <input
                  value={field.label}
                  onChange={(event) => updateField(field.id, { label: event.target.value })}
                  placeholder="User Name"
                />
              </label>

              <label>
                Name
                <input
                  value={field.name}
                  onChange={(event) => updateField(field.id, { name: normalizeName(event.target.value) })}
                  placeholder="user_name"
                />
              </label>

              <label>
                Input Type
                <select
                  value={field.type}
                  onChange={(event) => {
                    const value = event.target.value as FieldType;
                    if (value !== "select") {
                      setSelectOptionsDrafts((prev) => {
                        const next = { ...prev };
                        delete next[field.id];
                        return next;
                      });
                    }
                    updateField(field.id, {
                      type: value,
                      options: value === "select" ? (field.options ?? ["Option 1"]) : [],
                    });
                  }}
                >
                  {fieldTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(event) => updateField(field.id, { required: event.target.checked })}
                />
                Required
              </label>
            </div>

            {field.type === "select" && (
              <label>
                Options (comma-separated)
                <input
                  value={
                    field.id in selectOptionsDrafts ? selectOptionsDrafts[field.id] : (field.options ?? []).join(", ")
                  }
                  onChange={(event) => {
                    const rawValue = event.target.value;
                    setSelectOptionsDrafts((prev) => ({
                      ...prev,
                      [field.id]: rawValue,
                    }));
                    updateField(field.id, {
                      options: rawValue
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    });
                  }}
                  placeholder="Open, In Progress, Done"
                />
              </label>
            )}
          </article>
        ))}
      </div>

      <div className={styles.footerRow}>
        <span>{fields.length} fields saved</span>
        <Link to="/form-preview" className={styles.previewLink}>
          Go to form preview
        </Link>
      </div>
    </section>
  );
}

export default FormBuilderPage;
