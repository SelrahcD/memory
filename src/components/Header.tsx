import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="border-b border-gray-800 px-6 py-4">
      <Link to="/" className="text-xl font-bold text-gray-100 hover:text-amber-400 transition-colors">
        Memory Tools
      </Link>
    </header>
  );
}
