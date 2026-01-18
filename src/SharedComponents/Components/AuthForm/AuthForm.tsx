import { useMemo, useState, type ReactNode } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import type { FieldValues, Path, RegisterOptions } from "react-hook-form";
import { useForm } from "react-hook-form";

type InputType = "text" | "email" | "password" | "number" | "tel";

export type AuthField<TForm extends FieldValues> = {
  name: Path<TForm>;
  label: string;
  type?: InputType;
  placeholder?: string;
  rules?: RegisterOptions<TForm, Path<TForm>>;
};

type AuthFormProps<TForm extends FieldValues> = {
  subtitle?: string; // welcome to PMS
  title: string; // Log In / Register / Forget Password
  fields: AuthField<TForm>[];
  defaultValues?: Partial<TForm>;
  onSubmit: (data: TForm) => void | Promise<void>;
  submitLabel?: string; // Login / Create Account / Send Code
  hideFields?: Array<Path<TForm>>;
  footer?: ReactNode; // links area (Register / Forget ...)
  loading?: boolean;
};

export default function AuthForm<TForm extends FieldValues>({
  subtitle = "welcome to PMS",
  title,
  fields,

  onSubmit,
  submitLabel = "Submit",
  hideFields = [],
  footer,
  loading = false,
}: AuthFormProps<TForm>) {
  const {
    register,
    handleSubmit,
    formState: { errors  } , 
   
  } = useForm<TForm>({  });

  const finalFields = useMemo(
    () => fields.filter((f) => !hideFields.includes(f.name)),
    [fields, hideFields]
  );

  // show/hide لكل password field (لو عندك أكتر من واحد)
  const [showMap, setShowMap] = useState<Record<string, boolean>>({});
  const toggleShow = (name: string) =>
    setShowMap((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="auth-container">
      <div className="container-fluid">
        <div className="row justify-content-center align-items-center">
          <div className="bgtransparent rounded-3 m-1">
            <div className="form-container m-3">
              <div className="title-container">
                <p className="text-white mb-1">{subtitle}</p>
                <h4 className="primary-color" style={{ marginBottom: 0 }}>
                  {title}
                </h4>

                <hr
                  style={{
                    width: "18px",
                    height: "4px",
                    backgroundColor: "#f3a21b",
                    border: "none",
                    opacity: 1,
                    margin: "4px 0 0 0",
                    display: "block",
                  }}
                />
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                {finalFields.map((field) => {
                  const nameStr = String(field.name);
                  const fieldError = (errors as any)?.[nameStr];
                  const isPassword = field.type === "password";
                  const show = !!showMap[nameStr];

                  return (
                    <div key={nameStr} className="auth-field">
                      <label className="auth-label" htmlFor={nameStr}>
                        {field.label}
                      </label>

                      {isPassword ? (
                        <InputGroup className="auth-inputgroup">
                          <Form.Control
                            id={nameStr}
                            type={show ? "text" : "password"}
                            className="auth-input"
                            placeholder={field.placeholder || ""}
                            {...register(field.name, field.rules)}
                          />

                          <InputGroup.Text
                            as="button"
                            type="button"
                            className="auth-eye-btn"
                            onClick={() => toggleShow(nameStr)}
                            aria-label={
                              show ? "Hide password" : "Show password"
                            }
                          >
                            <i
                              className={`fa-solid ${
                                show ? "fa-eye-slash" : "fa-eye"
                              }`}
                            />
                          </InputGroup.Text>
                        </InputGroup>
                      ) : (
                        <Form.Control
                          id={nameStr}
                          type={field.type || "text"}
                          className="auth-input"
                          placeholder={field.placeholder || ""}
                          {...register(field.name, field.rules)}
                        />
                      )}

                      {fieldError?.message && (
                        <div className="alert alert-danger mt-2 p-2">
                          {String(fieldError.message)}
                        </div>
                      )}
                    </div>
                  );
                })}

                {footer && <div className="mt-3">{footer}</div>}

                <button
                  type="submit"
                  className="btn primary-color-bg w-100 mt-4 rounded-5"
                  disabled={loading}
                >
                  {loading ? "Loading..." : submitLabel}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
