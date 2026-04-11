import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { FORM_FIELDS_STORAGE_KEY } from "../constants/storageKeys";
import { loadFromStorage } from "../lib/localStorage";
import type { FormField } from "../types/form";
import styles from "./FormPreviewPage.module.css";

function getInitialValues(fields: FormField[]) {
  return fields.reduce<Record<string, string | number | boolean>>((acc, field) => {
    if (field.type === "checkbox") {
      acc[field.name] = false;
    } else {
      acc[field.name] = "";
    }
    return acc;
  }, {});
}

function FormPreviewPage() {
  const fields = useMemo(() => loadFromStorage<FormField[]>(FORM_FIELDS_STORAGE_KEY, []), []);

  const [values, setValues] = useState<Record<string, string | number | boolean>>(() => getInitialValues(fields));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Submitted form data:", values);
  }

  if (fields.length === 0) {
    return (
      <section className={styles.container}>
        <h2>Form Preview</h2>
        <p>No form configuration found.</p>
        <Link to="/form-builder" className={styles.linkButton}>
          Go to form builder
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>Form Preview</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {fields.map((field) => {
          const value = values[field.name];

          return (
            <label key={field.id} className={styles.row}>
              {field.label}

              {field.type === "textarea" && (
                <textarea
                  value={String(value)}
                  required={field.required}
                  onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.value }))}
                />
              )}

              {field.type === "select" && (
                <select
                  value={String(value)}
                  required={field.required}
                  onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.value }))}
                >
                  <option value="">Select...</option>
                  {(field.options ?? []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "checkbox" && (
                <input
                  type="checkbox"
                  checked={Boolean(value)}
                  required={field.required}
                  onChange={(event) => setValues((prev) => ({ ...prev, [field.name]: event.target.checked }))}
                />
              )}

              {(field.type === "text" || field.type === "number" || field.type === "date") && (
                <input
                  type={field.type}
                  value={String(value)}
                  required={field.required}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      [field.name]: field.type === "number" ? Number(event.target.value) : event.target.value,
                    }))
                  }
                />
              )}
            </label>
          );
        })}

        <button type="submit" className={styles.submitButton}>
          Submit Form
        </button>
      </form>
    </section>
  );
}

export default FormPreviewPage;
