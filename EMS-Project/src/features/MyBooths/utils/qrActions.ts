import QRCode from "qrcode";

export function resolveQrImageUrl(qrUrl: string) {
  if (/^(https?:|data:|blob:)/i.test(qrUrl)) {
    return qrUrl;
  }

  try {
    return new URL(qrUrl, import.meta.env.VITE_API_URL).toString();
  } catch {
    return qrUrl;
  }
}

export async function downloadQrPng(qrToken: string, filename: string) {
  const pngDataUrl = await QRCode.toDataURL(qrToken, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 1024,
    color: {
      dark: "#0a8782",
      light: "#ffffff",
    },
  });

  const link = document.createElement("a");
  link.href = pngDataUrl;
  link.download = filename;
  link.style.display = "none";
  document.body.append(link);
  link.click();
  link.remove();
}
