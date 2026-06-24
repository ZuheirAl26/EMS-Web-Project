import { useVerifyAccount } from "../../hooks/useVerifyAccount";

export default function VerifyAccountPage() {
  const { isPending, isError, isSuccess } = useVerifyAccount();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "20px",
        }}
      >
        {isPending && (
          <h3 style={{ color: "#454545" }}>⏳ Verifying security token...</h3>
        )}

        {isSuccess && (
          <h3 style={{ color: "#1e8e3e" }}>
            ✓ Email Verified! Closing this tab...
          </h3>
        )}

        {isError && (
          <h3 style={{ color: "#d93025" }}>
            ❌ Verification link expired or invalid.
          </h3>
        )}
      </div>
    </div>
  );
}
