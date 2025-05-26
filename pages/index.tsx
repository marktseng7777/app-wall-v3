import { useEffect, useState } from 'react';
import AppCard from '../components/AppCard';

interface AppItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  updatedAt: string;
}

export default function Home() {
  const [apps, setApps] = useState<AppItem[]>([]);

  useEffect(() => {
    fetch('https://api.jsonbin.io/v3/b/6834589e8960c979a5a1462a', {
      headers: { 'X-Master-Key': '$2a$10$aIekbx96Mq.yKSA22FzLse2LHFypzqYOo2o63Rd/aLRDV1U5Cw/nq' }
    })
      .then(res => res.json())
      .then(data => {
        const sorted = [...(data.record || [])].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setApps(sorted);
      });
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (!isMobile) {
    return <p className="text-center mt-20 text-gray-500">请使用手机设备浏览此页面</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-pink-100 py-6 px-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">🔥 热门 App 精选墙 🔥</h1>
      <div className="grid grid-cols-2 gap-4">
        {apps.map(app => (
          <AppCard key={app.id} {...app} />
        ))}
      </div>
    </div>
  );
}
