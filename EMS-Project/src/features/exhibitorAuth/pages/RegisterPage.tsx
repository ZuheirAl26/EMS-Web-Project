import { AuthSidebar, RegisterForm } from "../components";
import LanguageButton from "../../../components/Button/LangButton";
// import { useThemeStore } from "../../../context/useThemeStore";
import "./AuthLayout.scss";

function RegisterPage() {
  //   const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="login-page-layout">
      <div className="login-left-column">
        <AuthSidebar />
      </div>

      <div className="login-right-column">
        <div className="language-toggle">
          {/* <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button> */}
          <LanguageButton />
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
