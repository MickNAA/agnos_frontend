import { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";
import clsx from "clsx";

interface BaseFieldProps {
  label: string;
  error?: FieldError;
  required?: boolean;
  hint?: string;
}

interface InputFieldProps
  extends BaseFieldProps,
    InputHTMLAttributes<HTMLInputElement> {
  as?: "input";
}

interface SelectFieldProps
  extends BaseFieldProps,
    SelectHTMLAttributes<HTMLSelectElement> {
  as: "select";
  options: { value: string; label: string }[];
}

type FormFieldProps = InputFieldProps | SelectFieldProps;

export function FormField(props: FormFieldProps) {
  const { label, error, required, hint, as, ...rest } = props;

  return (
    <div>
      <label className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {as === "select" ? (
        <select
          className={clsx("form-input", error && "border-red-400 focus:ring-red-400")}
          {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {(props as SelectFieldProps).options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={clsx("form-input", error && "border-red-400 focus:ring-red-400")}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="form-error">{error.message}</p>}
    </div>
  );
}
