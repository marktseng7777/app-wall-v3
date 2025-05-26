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
    return <p className="text-center mt-20 text-gray-500">請使用手機裝置瀏覽此頁面</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      {apps.map(app => (
        <AppCard key={app.id} {...app} />
      ))}
    </div>
  );
}
