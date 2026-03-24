// api.js — All communication with the FastAPI backend

const API = (() => {
  const getBaseUrl = () =>
    localStorage.getItem('apiBaseUrl') || 'http://127.0.0.1:7000';

  const request = async (method, path, body = null) => {
    const url = `${getBaseUrl()}${path}`;
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (res.status === 204) return null;
    return res.json();
  };

  return {
    setBaseUrl(url) {
      localStorage.setItem('apiBaseUrl', url.replace(/\/$/, ''));
    },

    async ping() {
      try {
        await fetch(`${getBaseUrl()}/docs`, { method: 'HEAD' });
        return true;
      } catch {
        return false;
      }
    },

    // GET /todos/
    getAll() {
      return request('GET', '/todos/');
    },

    // GET /todos/:id
    getOne(id) {
      return request('GET', `/todos/${id}`);
    },

    // POST /todos/
    create(task, description = null) {
      return request('POST', '/todos/', { task, description, completed: false });
    },

    // PUT /todos/:id
    update(id, data) {
      return request('PUT', `/todos/${id}`, data);
    },

    // DELETE /todos/:id
    remove(id) {
      return request('DELETE', `/todos/${id}`);
    },
  };
})();
