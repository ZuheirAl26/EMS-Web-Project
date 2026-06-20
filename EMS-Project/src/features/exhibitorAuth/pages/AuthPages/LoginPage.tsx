// import { useThemeStore } from "../../../context/useThemeStore";
import { AuthSidebar, LoginForm } from "../../components";
import LanguageButton from "../../components/Button/LangButton";
import "./AuthLayout.scss";

function LoginPage() {
  // const { theme, toggleTheme } = useThemeStore();
  return (
    <div className="login-page-layout">
      <div className="login-left-column">
        <AuthSidebar />
      </div>

      <div className="login-right-column">
        {/* <div className="top-controls">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div> */}

        <div className="language-toggle">
          <LanguageButton />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
