// app/page.tsx
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Work from "@/components/Work";
import Working from "@/components/Working";

export default function Home() {
  return (
    <main>
      <section id="home">
        <Hero />
      </section>

      <section id="work">
        <Work />
      </section>

      <section id="working">
        <Working />
      </section>

      <section id="pricing">
        <Pricing />
      </section>

      <section id="footer">
        <Footer />
      </section>
    </main>
  );
}