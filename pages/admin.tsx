
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface AppItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  updatedAt: string;
}

interface SourceOption {
  key: string;
  label: string;
  binId: string;
}

const MASTER_KEY = '$2a$10$aIekbx96Mq.yKSA22FzLse2LHFypzqYOo2o63Rd/aLRDV1U5Cw/nq';

const sources: SourceOption[] = [
  { key: 'source-a', label: '聯盟 A 流量', binId: '6834589e8960c979a5a1462a' },
  { key: 'source-b', label: '聯盟 B 流量', binId: '683488908960c979a5a157eb' },
  { key: 'source-c', label: '聯盟 C 流量', binId: '6834889d8a456b7966a59913' }
];

export default function Admin() {
  const [selected, setSelected] = useState(sources[0]);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(selected.binId);
  }, [selected]);

  const fetchData = async (binId: string) => {
    setLoading(true);
    const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      headers: { 'X-Master-Key': MASTER_KEY }
    });
    const data = await res.json();
    setApps(data.record || []);
    setLoading(false);
  };

  const updateField = (id: string, field: keyof AppItem, value: string) => {
    setApps(prev =>
      prev.map(app => (app.id === id ? { ...app, [field]: value, updatedAt: new Date().toISOString() } : app))
    );
  };

  const addApp = () => {
    setApps(prev => [
      ...prev,
      { id: uuidv4(), name: '新 App', url: '', icon: '', updatedAt: new Date().toISOString() }
    ]);
  };

  const removeApp = (id: string) => {
    setApps(prev => prev.filter(app => app.id !== id));
  };

  const saveApps = async () => {
    await fetch(`https://api.jsonbin.io/v3/b/${selected.binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY,
        'X-Bin-Private': 'false'
      },
      body: JSON.stringify(apps)
    });
    alert('已儲存到 ' + selected.label);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">後台管理系統</h1>
      <label className="block mb-2 text-sm">選擇流量來源</label>
      <select
        className="mb-6 border p-2 rounded"
        value={selected.key}
        onChange={(e) => {
          const found = sources.find(s => s.key === e.target.value);
          if (found) setSelected(found);
        }}
      >
        {sources.map(opt => (
          <option key={opt.key} value={opt.key}>{opt.label}</option>
        ))}
      </select>

      <button onClick={addApp} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">新增 App</button>

      {loading ? (
        <p>載入中...</p>
      ) : (
        <div className="space-y-4">
          {apps.map(app => (
            <div key={app.id} className="border p-4 rounded bg-white text-black">
              <input
                value={app.name}
                onChange={(e) => updateField(app.id, 'name', e.target.value)}
                placeholder="名稱"
                className="block w-full mb-2 border p-1"
              />
              <input
                value={app.url}
                onChange={(e) => updateField(app.id, 'url', e.target.value)}
                placeholder="下載連結"
                className="block w-full mb-2 border p-1"
              />
              <input
                value={app.icon}
                onChange={(e) => updateField(app.id, 'icon', e.target.value)}
                placeholder="圖標網址"
                className="block w-full mb-2 border p-1"
              />
              <button onClick={() => removeApp(app.id)} className="text-red-600 text-sm">刪除</button>
            </div>
          ))}
        </div>
      )}

      <button onClick={saveApps} className="mt-6 bg-green-600 text-white px-4 py-2 rounded">儲存</button>
    </div>
  );
}
