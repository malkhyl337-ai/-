/**
 * Google Workspace Integration Helpers using REST APIs.
 */

// Format book summary text beautifully for Google Doc / Drive file
export function formatSummaryForExport(
  title: string,
  author: string,
  year: number | string,
  category: string,
  overview: string,
  keyConcepts: Array<{ title: string; description: string }>,
  quotes: Array<{ text: string; context: string }>
): string {
  let text = `=========================================\n`;
  text += `ملخص كتاب: ${title}\n`;
  text += `=========================================\n\n`;
  text += `الكاتب: ${author}\n`;
  if (year) text += `سنة النشر: ${year}\n`;
  text += `التصنيف: ${category}\n\n`;
  text += `-----------------------------------------\n`;
  text += `نبذة عامة:\n`;
  text += `-----------------------------------------\n`;
  text += `${overview}\n\n`;

  if (keyConcepts && keyConcepts.length > 0) {
    text += `-----------------------------------------\n`;
    text += `المفاهيم والأفكار الأساسية:\n`;
    text += `-----------------------------------------\n`;
    keyConcepts.forEach((concept, index) => {
      text += `${index + 1}. ${concept.title}:\n`;
      text += `   ${concept.description}\n\n`;
    });
  }

  if (quotes && quotes.length > 0) {
    text += `-----------------------------------------\n`;
    text += `أشهر الاقتباسات من الكتاب:\n`;
    text += `-----------------------------------------\n`;
    quotes.forEach((quote) => {
      text += `• "${quote.text}"\n`;
      text += `  — (${quote.context})\n\n`;
    });
  }

  text += `-----------------------------------------\n`;
  text += `تم التصدير بواسطة تطبيق ملخصات علم النفس الذكي\n`;
  text += `=========================================\n`;

  return text;
}

/**
 * Creates a Google Doc and inserts the summary contents.
 * Returns the document URL.
 */
export async function exportToGoogleDoc(
  accessToken: string,
  title: string,
  formattedText: string
): Promise<{ docId: string; url: string }> {
  // 1. Create a blank Google Document
  const createResponse = await fetch("https://docs.googleapis.com/v1/documents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: `ملخص: ${title}`,
    }),
  });

  if (!createResponse.ok) {
    const err = await createResponse.json();
    throw new Error(err.error?.message || "Failed to create Google Document");
  }

  const doc = await createResponse.json();
  const documentId = doc.documentId;

  // 2. Insert text into the Google Document
  const updateResponse = await fetch(
    `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: formattedText,
            },
          },
        ],
      }),
    }
  );

  if (!updateResponse.ok) {
    const err = await updateResponse.json();
    throw new Error(err.error?.message || "Failed to write content to Google Document");
  }

  return {
    docId: documentId,
    url: `https://docs.google.com/document/d/${documentId}/edit`,
  };
}

/**
 * Uploads a text file directly to Google Drive.
 * Returns the file ID and web view link.
 */
export async function exportToGoogleDriveFile(
  accessToken: string,
  filename: string,
  content: string
): Promise<{ fileId: string; url: string }> {
  const boundary = "foo_bar_boundary";
  const metadata = {
    name: `${filename}.txt`,
    mimeType: "text/plain",
  };

  const multipartBody =
    `\r\n--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: text/plain; charset=UTF-8\r\n\r\n` +
    `${content}\r\n` +
    `--${boundary}--`;

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "Failed to upload file to Google Drive");
  }

  const file = await response.json();
  return {
    fileId: file.id,
    url: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
  };
}

/**
 * Lists Google Drive files that represent exported summaries.
 */
export async function listExportedFiles(
  accessToken: string
): Promise<Array<{ id: string; name: string; url: string; createdTime: string; mimeType: string }>> {
  const q = encodeURIComponent(
    "name contains 'ملخص' and (mimeType = 'application/vnd.google-apps.document' or mimeType = 'text/plain') and trashed = false"
  );
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&orderBy=createdTime desc&fields=files(id,name,webViewLink,createdTime,mimeType)&pageSize=20`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    console.error("Failed to list Drive files:", await response.text());
    return [];
  }

  const data = await response.json();
  return (data.files || []).map((file: any) => ({
    id: file.id,
    name: file.name,
    url: file.webViewLink,
    createdTime: file.createdTime,
    mimeType: file.mimeType,
  }));
}
