chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "noteExists") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.action.setBadgeText({ tabId: tabs[0].id, text: "📝" });
        chrome.action.setBadgeBackgroundColor({ tabId: tabs[0].id, color: "#4688F1" });
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tab.url);
  const key = url.origin + url.pathname;

  const noteEl = document.getElementById('note');
  const saveBtn = document.getElementById('save');
  const deleteBtn = document.getElementById('delete');
  const confirmBox = document.getElementById('confirmBox');
  const confirmDelete = document.getElementById('confirmDelete');
  const cancelDelete = document.getElementById('cancelDelete');

  chrome.storage.local.get([key], (result) => {
    const note = result[key] || '';
    noteEl.value = note;
    deleteBtn.classList.toggle('hidden', !note);
  });

  saveBtn.addEventListener('click', () => {
    const note = noteEl.value.trim();
    const data = {};
    data[key] = note;

    if (note) {
      chrome.storage.local.set(data, () => {
        saveBtn.textContent = 'Saved!';
        deleteBtn.classList.remove('hidden');
        setTimeout(() => saveBtn.textContent = 'Save', 1000);
      });
    }
  });
  
  deleteBtn.addEventListener('click', () => {
    confirmBox.classList.remove('hidden');
  });

  cancelDelete.addEventListener('click', () => {
    confirmBox.classList.add('hidden');
  });

  confirmDelete.addEventListener('click', () => {
    chrome.storage.local.remove(key, () => {
      noteEl.value = '';
      confirmBox.classList.add('hidden');
      deleteBtn.classList.add('hidden');
      saveBtn.textContent = 'Deleted!';
      setTimeout(() => saveBtn.textContent = 'Save', 1000);
    });
  });
  
});