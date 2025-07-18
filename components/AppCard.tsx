interface AppCardProps {
  name: string;
  url: string;
  icon: string;
}

export default function AppCard({ name, url, icon }: AppCardProps) {
  return (
    <div className="border rounded-2xl p-4 shadow bg-neutral-900 text-white hover:scale-105 transition-transform duration-300">
      <img
        src={icon}
        alt={name}
        onError={(e) => (e.currentTarget.src = '/fallback.png')}
        className="w-full max-w-[192px] h-auto aspect-square object-cover rounded-xl block mx-auto shadow-md"
      />
      <h3 className="text-center mt-2 text-lg font-semibold text-white no-underline">{name}</h3>
      <div className="block mt-4 text-center bg-white text-black hover:bg-gray-300 rounded-lg py-2 transition-colors no-underline">
        下載
      </div>
    </div>
  );
}