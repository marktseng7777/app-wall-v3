interface AppCardProps {
  name: string;
  url: string;
  icon: string;
}

export default function AppCard({ name, url, icon }: AppCardProps) {
  return (
    <div className="border rounded-2xl p-4 shadow mb-4 bg-white">
      <img src={icon} alt={name} className="w-20 h-20 rounded-xl mx-auto" />
      <h3 className="text-center mt-2 text-lg font-semibold">{name}</h3>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-4 text-center bg-blue-500 text-white rounded-lg py-2"
      >
        下載
      </a>
    </div>
  );
}
