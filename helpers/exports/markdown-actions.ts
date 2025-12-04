/**
 * Copy markdown content to clipboard
 */
export async function copyToClipboard(
  content: string,
  itemName: string
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", itemName, error);
    return false;
  }
}

/**
 * Download markdown content as a file with save dialog
 */
export async function downloadMarkdown(
  content: string,
  itemName: string,
  dataSource: string
): Promise<void> {
  try {
    // Create a safe filename
    const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const safeItemName = itemName.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const filename = `${dataSource}-${safeItemName}-export-${timestamp}.md`;

    // Check if File System Access API is supported
    if ("showSaveFilePicker" in window) {
      // Use modern File System Access API to show save dialog
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: "Markdown Files",
            accept: { "text/markdown": [".md"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
    } else {
      // Fallback for browsers that don't support File System Access API
      const blob = new Blob([content], {
        type: "text/markdown;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    // User cancelled the save dialog
    if (error instanceof Error && error.name === "AbortError") {
      console.log("User cancelled save dialog");
      return;
    }
    console.error("Failed to download markdown:", error);
    throw error;
  }
}
