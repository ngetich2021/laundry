// app/(site)/page.tsx
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Work from "@/components/Work";
import Working from "@/components/Working";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Royal Laundry & Dry Cleaners, Eldoret",
  description:
    "Wash, iron and fold with free pickup and delivery. Rock Centre on Eldoret–Iten Road, next to Palmcare Sinai Hospital. From KES 100/kg. Call 0790 212 210.",
  path: "/",
  image: "/og/og-home.jpg",
  absoluteTitle: true,
});

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
