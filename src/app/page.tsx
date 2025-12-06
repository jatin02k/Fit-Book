import { HeroPage } from "./components/HeroPage";
import { Navigation } from "./components/navigation";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <HeroPage />
      </main>
    </div>
  );
}

