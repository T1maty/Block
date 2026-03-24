// ui.js — All DOM rendering and UI helpers

const UI = (() => {

  // ── Toast ──────────────────────────────────────────────────
  let toastTimer;
  const showToast = (msg, isError = false) => {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = 'toast show' + (isError ? ' err' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.className = 'toast'; }, 2500);
  };

  // ── API status indicator ───────────────────────────────────
  const setApiStatus = (online) => {
    const dot   = document.getElementById('apiIndicator');
    const label = document.getElementById('apiLabel');
    if (online) {
      dot.className   = 'api-dot online';
      label.textContent = 'API connected';
    } else {
      dot.className   = 'api-dot offline';
      label.textContent = 'Local mode';
    }
  };

  // ── Task count ─────────────────────────────────────────────
  const updateCount = (todos) => {
    const active = todos.filter(t => !t.completed).length;
    document.getElementById('taskCount').textContent =
      active === 1 ? '1 task remaining' : `${active} tasks remaining`;
  };

  // ── Render single todo item ────────────────────────────────
  const renderItem = (todo, onToggle, onDelete) => {
    const item = document.createElement('div');
    item.className = 'todo-item' + (todo.completed ? ' completed' : '');
    item.dataset.id = todo.id;

    const check = document.createElement('div');
    check.className = 'todo-check' + (todo.completed ? ' checked' : '');
    check.addEventListener('click', () => onToggle(todo.id));

    const body = document.createElement('div');
    body.className = 'todo-body';

    const task = document.createElement('div');
    task.className = 'todo-task';
    task.textContent = todo.task;

    body.appendChild(task);

    if (todo.description) {
      const desc = document.createElement('div');
      desc.className = 'todo-desc';
      desc.textContent = todo.description;
      body.appendChild(desc);
    }

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn delete';
    delBtn.title = 'Delete';
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', () => onDelete(todo.id));

    actions.appendChild(delBtn);
    item.appendChild(check);
    item.appendChild(body);
    item.appendChild(actions);

    return item;
  };

  // ── Render full list ───────────────────────────────────────
  const renderList = (todos, filter, onToggle, onDelete) => {
    const list  = document.getElementById('todoList');
    const empty = document.getElementById('emptyState');

    const filtered = todos.filter(t => {
      if (filter === 'active')    return !t.completed;
      if (filter === 'completed') return  t.completed;
      return true;
    });

    // Remove old items (keep emptyState)
    Array.from(list.children).forEach(c => {
      if (c.id !== 'emptyState') c.remove();
    });

    if (filtered.length === 0) {
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    filtered.forEach(todo => {
      list.appendChild(renderItem(todo, onToggle, onDelete));
    });
  };

  return { showToast, setApiStatus, updateCount, renderList };
})();
