import { useEffect, useState } from 'react';
import AppCard from '../components/AppCard';

interface AppItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  updatedAt: string;
}

interface Props {
  apps: AppItem[];
}

export default function SourceB({ apps }: Props) {
  return (
    <div className="min-h-screen bg-black text-white py-6 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">🔥 熱門 App 精選牆 - Source B 🔥</h1>
      {apps.length === 0 ? (
        <p className="text-center text-gray-400">沒有可用的 App</p>
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

export async function getServerSideProps() {
  try {
    const res = await fetch('https://api.jsonbin.io/v3/b/683488908960c979a5a157eb', {
      headers: {
        'X-Master-Key': '$2a$10$aIekbx96Mq.yKSA22FzLse2LHFypzqYOo2o63Rd/aLRDV1U5Cw/nq'
      }
    });

    if (!res.ok) throw new Error('Fetch failed');

    const data = await res.json();

    const sorted = [...(data.record || [])].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return {
      props: {
        apps: sorted
      }
    };
  } catch (err) {
    console.error('Error loading JSONBin (Source B):', err);
    return {
      props: {
        apps: []
      }
    };
  }
}
