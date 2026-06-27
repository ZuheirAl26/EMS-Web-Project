import "./PasswordStrengthBar.scss";

interface PasswordStrengthBarProps {
  strength: number;
  password: string;
  confirmPassword?: string;
}

const labels = ["", "Weak", "Fair", "Good", "Strong"];
const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

export default function PasswordStrengthBar({
  strength,
  password,
  confirmPassword,
}: PasswordStrengthBarProps) {
  if (!password) return null;

  const checks = [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "One uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "One number", pass: /[0-9]/.test(password) },
    {
      label: "One special character (!@#...)",
      pass: /[^A-Za-z0-9]/.test(password),
    },
    ...(confirmPassword !== undefined
      ? [
          {
            label: "Passwords match",
            pass: password === confirmPassword && confirmPassword.length > 0,
          },
        ]
      : []),
  ];

  return (
    <div className="password-strength">
      <div className="strength-bars">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="strength-bar"
            style={{
              backgroundColor:
                strength >= level ? colors[strength] : "var(--color-border)",
            }}
          />
        ))}
      </div>
      {strength > 0 && (
        <span className="strength-label" style={{ color: colors[strength] }}>
          {labels[strength]}
        </span>
      )}
      <div className="strength-checks">
        {checks.map((check) => (
          <div
            key={check.label}
            className={`check-item ${check.pass ? "pass" : ""}`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              {check.pass ? (
                <polyline points="20 6 9 17 4 12" />
              ) : (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              )}
            </svg>
            <span>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
