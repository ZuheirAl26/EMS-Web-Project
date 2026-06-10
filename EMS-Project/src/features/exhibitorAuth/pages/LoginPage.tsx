import { AuthSidebar, LoginForm } from "../components";
import "./LoginPage.scss";

function LoginPage() {
  return (
    <div className="login-page-layout">
      <div className="login-left-column">
        <AuthSidebar />
      </div>

      <div className="login-right-column">
        <div className="language-toggle">
          <button className="">🌐 AR</button>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
