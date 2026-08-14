import { apiClient } from "../../../api/ApiClient";

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

async function getQrImageBlob(qrUrl: string) {
  const response = await apiClient.get<Blob>(qrUrl, {
    responseType: "blob",
  });

  return response.data;
}

export async function downloadQrImage(qrUrl: string, filename: string) {
  const blob = await getQrImageBlob(qrUrl);
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}

export async function printQrImage(qrUrl: string, documentTitle: string) {
  const printWindow = window.open("", "_blank", "width=720,height=720");

  if (!printWindow) {
    throw new Error("The print window could not be opened.");
  }

  try {
    const blob = await getQrImageBlob(qrUrl);
    const objectUrl = URL.createObjectURL(blob);
    const printDocument = printWindow.document;
    const style = printDocument.createElement("style");
    const image = printDocument.createElement("img");

    printDocument.title = documentTitle;
    style.textContent = `
      @page { margin: 20mm; }
      body { min-height: 100vh; margin: 0; display: grid; place-items: center; }
      img { width: min(100%, 520px); height: auto; }
    `;
    printDocument.head.append(style);
    image.alt = documentTitle;
    image.src = objectUrl;
    printDocument.body.append(image);

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      printWindow.close();
    };

    printWindow.addEventListener("afterprint", cleanup, { once: true });

    await new Promise<void>((resolve, reject) => {
      image.addEventListener(
        "load",
        () => {
          printWindow.focus();
          printWindow.print();
          resolve();
        },
        { once: true },
      );
      image.addEventListener(
        "error",
        () => {
          cleanup();
          reject(new Error("The QR image could not be loaded."));
        },
        { once: true },
      );
    });
  } catch (error) {
    printWindow.close();
    throw error;
  }
}
