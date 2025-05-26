import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface AppItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [form, setForm] = useState({ name: '', url: '', icon: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const API_URL = 'https://api.jsonbin.io/v3/b/6834589e8960c979a5a1462a';
  const API_KEY = '$2a$10$aIekbx96Mq.yKSA22FzLse2LHFypzqYOo2o63Rd/aLRDV1U5Cw/nq';

  const fetchApps = async () => {
    const res = await fetch(API_URL, { headers: { 'X-Master-Key': API_KEY } });
    const data = await res.json();
    const sorted = [...(data.record || [])].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    setApps(sorted);
  };

  const saveApps = async (newApps: AppItem[]) => {
    const sorted = [...newApps].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY,
      },
      body: JSON.stringify(sorted),
    });
    setApps(sorted);
  };

  const handleAddOrUpdate = () => {
    if (!form.name.trim() || !form.url.trim() || !form.icon.trim()) return;
    const now = new Date().toISOString();
    if (editingId) {
      const updated = apps.map(app =>
        app.id === editingId
          ? { ...app, name: form.name.trim(), url: form.url.trim(), icon: form.icon.trim(), updatedAt: now }
          : app
      );
      saveApps(updated);
      setEditingId(null);
    } else {
      const newApp: AppItem = {
        id: uuidv4(),
        name: form.name.trim(),
        url: form.url.trim(),
        icon: form.icon.trim(),
        createdAt: now,
        updatedAt: now,
      };
      saveApps([...apps, newApp]);
    }
    setForm({ name: '', url: '', icon: '' });
  };

  const handleDelete = (id: string) => {
    const updated = apps.filter(app => app.id !== id);
    saveApps(updated);
  };

  const handleEdit = (id: string) => {
    const app = apps.find(app => app.id === id);
    if (app) {
      setForm({ name: app.name, url: app.url, icon: app.icon });
      setEditingId(id);
    }
  };

  useEffect(() => { fetchApps(); }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">App 管理後台</h1>
      <div className="space-y-2 mb-6">
        <input placeholder="名稱" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2 w-full" />
        <input placeholder="網址" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} className="border p-2 w-full" />
        <input placeholder="圖示網址" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="border p-2 w-full" />
        <button onClick={handleAddOrUpdate} className="bg-green-500 text-white px-4 py-2 rounded">
          {editingId ? '更新卡片' : '新增卡片'}
        </button>
      </div>
      <ul className="space-y-4">
        {apps.map(app => (
          <li key={app.id} className="border p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <img src={app.icon} alt={app.name} className="w-12 h-12 rounded" />
              <div className="flex-1">
                <p className="font-bold">{app.name}</p>
                <a href={app.url} className="text-blue-600 text-sm" target="_blank" rel="noopener noreferrer">{app.url}</a>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(app.id)} className="text-blue-600">編輯</button>
                <button onClick={() => handleDelete(app.id)} className="text-red-600">刪除</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
