import Hero from "../components/sections/Hero";
import Categories from "../components/sections/Categories";
import HowItWorks from "../components/sections/HowItWorks";

export default function Home() {
  return (
    <div>
      <main>
        <Hero
          title="Votre réseau"
          subtitle="qui échange"
          labelTitle="vraiment"
          spanTitle="proche"
          endTitle="de chez vous"
          description="Recolteo connecte commerçants et associations pour une solidarité simple et rapide. Une action où tout le monde y gagne."
          primaryButton="Explorer la plateforme"
          secondaryButton="Voir une démo en 90s"
        />
        <Categories />
        <HowItWorks />
      </main>
    </div>
  );
}
