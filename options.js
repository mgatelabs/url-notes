const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const exportArea = document.getElementById("exportArea");
const importArea = document.getElementById("importArea");
const status = document.getElementById("status");

// Export all notes as base64-encoded JSON
exportBtn.onclick = () => {
  chrome.storage.local.get(null, (data) => {
    const json = JSON.stringify(data);
    const base64 = btoa(unescape(encodeURIComponent(json))); // UTF-8 safe
    exportArea.value = base64;
    status.textContent = "Exported successfully.";
  });
};

// Import base64-encoded JSON
importBtn.onclick = () => {
  try {
    const decoded = decodeURIComponent(escape(atob(importArea.value.trim())));
    const data = JSON.parse(decoded);

    chrome.storage.local.set(data, () => {
      status.textContent = "Imported successfully.";
    });
  } catch (e) {
    status.textContent = "Failed to import. Check format.";
    console.error("Import failed:", e);
  }
};
