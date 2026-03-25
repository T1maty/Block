// app.js — Entry point, wires everything together

(async () => {
  let todos  = [];
  let filter = 'all';

  // ── Initial API check ──────────────────────────────────────
  const initApi = async () => {
    const online = await API.ping();
    Store.setApiMode(online);
    UI.setApiStatus(online);
    return online;
  };

  // ── Refresh list ───────────────────────────────────────────
  const refresh = async () => {
    try {
      todos = await Store.getAll();
    } catch (e) {
      UI.showToast('Failed to load todos', true);
      todos = [];
    }
    UI.renderList(todos, filter, handleToggle, handleDelete);
    UI.updateCount(todos);
  };

  // ── Handlers ───────────────────────────────────────────────
  const handleAdd = async () => {
    const taskEl = document.getElementById('taskInput');
    const descEl = document.getElementById('descInput');
    const task   = taskEl.value.trim();
    const desc   = descEl.value.trim();

    if (!task) {
      UI.showToast('Task cannot be empty', true);
      taskEl.focus();
      return;
    }

    try {
      await Store.add(task, desc || null);
      taskEl.value = '';
      descEl.value = '';
      await refresh();
      UI.showToast('Task added ✓');
    } catch (e) {
      UI.showToast('Failed to add task', true);
    }
  };

  const handleToggle = async (id) => {
    try {
      await Store.toggle(id);
      await refresh();
    } catch (e) {
      UI.showToast('Failed to update task', true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await Store.remove(id);
      await refresh();
      UI.showToast('Task deleted');
    } catch (e) {
      UI.showToast('Failed to delete task', true);
    }
  };

  const handleClearCompleted = async () => {
    try {
      await Store.clearCompleted();
      await refresh();
      UI.showToast('Cleared completed tasks');
    } catch (e) {
      UI.showToast('Failed to clear tasks', true);
    }
  };

  // ── Theme toggle ───────────────────────────────────────────
  const themeBtn  = document.getElementById('themeToggle');
  const themeIcon = themeBtn.querySelector('.toggle-icon');
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.className = savedTheme;
  themeIcon.textContent = savedTheme === 'dark' ? '☾' : '☀';

  themeBtn.addEventListener('click', () => {
    const dark = document.body.classList.toggle('dark');
    document.body.classList.toggle('light', !dark);
    themeIcon.textContent = dark ? '☾' : '☀';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });

  // ── API Settings modal ─────────────────────────────────────
  const overlay    = document.getElementById('modalOverlay');
  const apiUrlInput= document.getElementById('apiUrl');
  const connStatus = document.getElementById('connectionStatus');

  document.getElementById('settingsBtn').addEventListener('click', () => {
    apiUrlInput.value = localStorage.getItem('apiBaseUrl') || 'http://127.0.0.1:8000';
    connStatus.textContent = '';
    connStatus.className = 'connection-status';
    overlay.classList.add('open');
  });

  document.getElementById('modalCancel').addEventListener('click', () => {
    overlay.classList.remove('open');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  document.getElementById('modalSave').addEventListener('click', async () => {
    const url = apiUrlInput.value.trim();
    if (!url) return;
    API.setBaseUrl(url);
    connStatus.textContent = 'Testing connection…';
    connStatus.className = 'connection-status';
    const ok = await initApi();
    if (ok) {
      connStatus.textContent = '✓ Connected successfully';
      connStatus.className = 'connection-status ok';
      await refresh();
      setTimeout(() => overlay.classList.remove('open'), 900);
    } else {
      connStatus.textContent = '✕ Could not reach server — using local mode';
      connStatus.className = 'connection-status err';
    }
  });

  // ── Add button & Enter key ─────────────────────────────────
  document.getElementById('addBtn').addEventListener('click', handleAdd);
  document.getElementById('taskInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAdd();
  });
  document.getElementById('descInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAdd();
  });

  // ── Filter tabs ────────────────────────────────────────────
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filter = tab.dataset.filter;
      UI.renderList(todos, filter, handleToggle, handleDelete);
    });
  });

  // ── Clear completed ────────────────────────────────────────
  document.getElementById('clearCompleted').addEventListener('click', handleClearCompleted);

  // ── Boot ───────────────────────────────────────────────────
  await initApi();
  await refresh();
})();
