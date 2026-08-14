import QRCode from "qrcode";

const QR_SCAN_BASE_URL =
  import.meta.env.VITE_QR_SCAN_BASE_URL ?? "https://localhost:8000";

const QR_OPTIONS = {
  errorCorrectionLevel: "M" as const,
  margin: 2,
  width: 1024,
  color: {
    dark: "#0a8782",
    light: "#ffffff",
  },
};

function createQrPayload(qrToken: string) {
  return new URL(
    `/scan/${encodeURIComponent(qrToken)}`,
    QR_SCAN_BASE_URL,
  ).toString();
}

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

async function createQrPngDataUrl(qrToken: string) {
  return QRCode.toDataURL(createQrPayload(qrToken), QR_OPTIONS);
}

export async function downloadQrPng(qrToken: string, filename: string) {
  const pngDataUrl = await createQrPngDataUrl(qrToken);
  const link = document.createElement("a");
  link.href = pngDataUrl;
  link.download = filename;
  link.style.display = "none";
  document.body.append(link);
  link.click();
  link.remove();
}

export async function printQrPng(qrToken: string, boothNumber: string) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("The print window could not be opened.");
  }

  try {
    const pngDataUrl = await createQrPngDataUrl(qrToken);
    const printDocument = printWindow.document;
    const style = printDocument.createElement("style");
    const content = printDocument.createElement("main");
    const title = printDocument.createElement("h1");
    const subtitle = printDocument.createElement("p");
    const image = printDocument.createElement("img");

    printDocument.title = `Booth ${boothNumber} QR`;
    style.textContent = `
      @page { margin: 0; }
      * { box-sizing: border-box; }
      body { width: 100vw; min-height: 100vh; margin: 0; background: #ffffff; color: #111827; font-family: Inter, Arial, sans-serif; }
      main { min-height: 100vh; padding: 22mm; display: grid; align-content: center; justify-items: center; gap: 16px; text-align: center; }
      h1 { margin: 0; font-size: 28px; line-height: 1.25; }
      p { margin: 0; color: #64748b; font-size: 16px; }
      img { width: min(76vw, 180mm); height: auto; display: block; }
    `;
    title.textContent = `Booth ${boothNumber}`;
    subtitle.textContent = "Scan QR code";
    image.alt = `Booth ${boothNumber} QR code`;
    image.src = pngDataUrl;

    content.append(title, subtitle, image);
    printDocument.head.append(style);
    printDocument.body.append(content);

    image.addEventListener(
      "load",
      () => {
        printWindow.focus();
        printWindow.print();
      },
      { once: true },
    );
    printWindow.addEventListener(
      "afterprint",
      () => printWindow.close(),
      { once: true },
    );
  } catch (error) {
    printWindow.close();
    throw error;
  }
}
