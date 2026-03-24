// store.js — Local state management + API sync

const Store = (() => {
  let todos   = [];
  let useApi  = false;
  let apiOnline = false;

  const STORAGE_KEY = 'block_todos';

  // ── Persistence (local fallback) ──────────────────────────
  const saveLocal = () =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));

  const loadLocal = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  };

  // ── API mode ───────────────────────────────────────────────
  const setApiMode = (online) => {
    useApi    = online;
    apiOnline = online;
  };

  const isApiOnline = () => apiOnline;

  // ── CRUD ───────────────────────────────────────────────────
  const getAll = async () => {
    if (useApi) {
      todos = await API.getAll();
    } else {
      todos = loadLocal();
    }
    return [...todos];
  };

  const add = async (task, description) => {
    if (useApi) {
      const t = await API.create(task, description);
      todos.push(t);
      return t;
    } else {
      const t = {
        id: Date.now(),
        task,
        description: description || null,
        completed: false,
      };
      todos.push(t);
      saveLocal();
      return t;
    }
  };

  const toggle = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    todo.completed = !todo.completed;
    if (useApi) {
      await API.update(id, { completed: todo.completed });
    } else {
      saveLocal();
    }
    return { ...todo };
  };

  const remove = async (id) => {
    if (useApi) {
      await API.remove(id);
    }
    todos = todos.filter(t => t.id !== id);
    if (!useApi) saveLocal();
  };

  const clearCompleted = async () => {
    const completed = todos.filter(t => t.completed);
    for (const t of completed) {
      await remove(t.id);
    }
  };

  return { getAll, add, toggle, remove, clearCompleted, setApiMode, isApiOnline };
})();
