import { AuthSidebar, LoginForm } from "../components";
import "./LoginPage.scss";
import { useLanguageStore } from "../../../context/useLanguageStore";

function LoginPage() {
  const { language, toggleLanguage } = useLanguageStore();
  return (
    <div className="login-page-layout">
      <div className="login-left-column">
        <AuthSidebar />
      </div>

      <div className="login-right-column">
        <div className="language-toggle">
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
          >
            🌐 {language === "en" ? "AR" : "EN"}
          </button>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
