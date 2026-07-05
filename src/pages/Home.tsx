import ToolCard from '../components/ToolCard';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-16">
      <h1 className="text-4xl font-bold mb-2 text-gray-100">Memory Tools</h1>
      <p className="text-gray-400 mb-12">Practice your peg system</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
        <ToolCard
          to="/peg-list"
          title="Peg List"
          description="Look up the word for any number 00–99"
          icon="📋"
        />
        <ToolCard
          to="/peg-quiz"
          title="Peg Quiz"
          description="Type the word that goes with a random number"
          icon="🎯"
        />
      </div>
    </div>
  );
}
