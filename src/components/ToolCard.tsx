import { Link } from 'react-router-dom';

type Props = {
  to: string;
  title: string;
  description: string;
  icon: string;
};

export default function ToolCard({ to, title, description, icon }: Props) {
  return (
    <Link
      to={to}
      className="block rounded-xl border border-gray-800 bg-gray-900 p-6 hover:border-amber-500/50 hover:bg-gray-800/80 transition-all"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-gray-100 mb-2">{title}</h2>
      <p className="text-gray-400 text-sm">{description}</p>
    </Link>
  );
}
