import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GoogleButton from "../Button/GoogleButton";
import "./RegisterForm.scss";
import {
  validateRegisterForm,
  type RegisterErrors,
} from "../../utils/authValidation";
import PasswordInput from "../Input/PasswordInput";
import TextInput from "../Input/TextInput";

function RegisterForm() {
  const { t } = useTranslation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateRegisterForm(
      { fullName, email, password, confirmPassword },
      t,
    );

    if (isValid) {
      console.log("Validation passed! Ready to submit:", {
        fullName,
        email,
        password,
      });
    } else {
      setErrors(validationErrors);
    }
  };
  return (
    <div className="register-form-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h2>{t("register.welcome")}</h2>
          <p className="subtitle">{t("register.instructions")}</p>
        </div>

        <div className="auth-tabs">
          <Link className="tab" to="/login">
            {t("login.tabs.logIn")}
          </Link>
          <Link className="tab active" to="/register">
            {t("login.tabs.createAccount")}
          </Link>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <TextInput
            id="fullName"
            label={t("register.form.fullName")}
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName)
                setErrors({ ...errors, fullName: undefined });
            }}
            placeholder={t("register.form.fullNamePlaceholder")}
            error={errors.fullName}
          />

          <TextInput
            id="email"
            type="email"
            label={t("login.form.email")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            placeholder={t("login.form.emailPlaceholder")}
            error={errors.email}
          />

          <div className="input-group">
            <label htmlFor="password">{t("login.form.password")}</label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors({ ...errors, password: undefined });
              }}
              placeholder={t("register.form.passwordPlaceholder")}
              error={errors.password}
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">
              {t("register.form.confirmPassword")}
            </label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: undefined });
              }}
              placeholder={t("register.form.confirmPlaceholder")}
              error={errors.confirmPassword}
            />
          </div>

          <button type="submit" className="primary-btn">
            {t("register.form.submit")}
            <svg
              className="btn-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <div className="divider">
            <span>{t("login.form.or")}</span>
          </div>
          <GoogleButton />
        </form>

        <div className="form-footer">
          <p>
            {t("register.footer.hasAccount")}{" "}
            <Link to="/login">{t("login.tabs.logIn")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
