import { useEffect, useState } from 'react';
import AppCard from '../components/AppCard';

interface AppItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  updatedAt: string;
}

export default function SourceA() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    fetch('https://api.jsonbin.io/v3/b/6834589e8960c979a5a1462a', {
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

  if (isMobile === null) return <div className="text-center mt-20 text-gray-400">載入中...</div>;
  if (!isMobile) return <p className="text-center mt-20 text-gray-400">请使用手机设备浏览此页面</p>;

  return (
    <div className="min-h-screen bg-black text-white py-6 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">🔥 熱門 App 精選牆 - Source A 🔥</h1>
      {loading ? (
        <p className="text-center text-gray-400">正在載入 App 清單...</p>
      ) : (
        <div className="flex flex-wrap gap-4 justify-between">
          {apps.map(app => (
            <div key={app.id} className="w-[48%]">
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
