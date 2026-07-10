import { useLanguageStore } from "../../../../context/useLanguageStore";

function LanguageButton() {
  const { language, toggleLanguage } = useLanguageStore();
  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
    >
      🌐 {language === "en" ? "AR" : "EN"}
    </button>
  );
}

export default LanguageButton;
