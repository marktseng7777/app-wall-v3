import { useEffect, useState } from 'react';
import AppCard from '../components/AppCard';

interface AppItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  updatedAt: string;
}

export default function SourceB() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.jsonbin.io/v3/b/683488908960c979a5a157eb', {
      headers: {
        'X-Master-Key': '$2a$10$aIekbx96Mq.yKSA22FzLse2LHFypzqYOo2o63Rd/aLRDV1U5Cw/nq'
      }
    })
      .then(res => res.json())
      .then(data => {
        const sorted = [...(data.record || [])].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setApps(sorted);
        setLoading(false);
      });
  }, []);


  return (
    <div className="min-h-screen bg-black text-white py-6 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">🔥 熱門 App 精選牆 🔥</h1>
      {loading ? (
        <p className="text-center text-gray-400">正在載入 App 清單...</p>
      ) : (
        <div className="flex flex-wrap justify-start -mx-1">
          {apps.map(app => (
            <div key={app.id} className="w-1/3 px-1 box-border">
              <a href={app.url} target="_blank" rel="noopener noreferrer">
                <AppCard {...app} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}