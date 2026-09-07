// app/(site)/page.tsx
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Work from "@/components/Work";
import Working from "@/components/Working";
import { prisma } from "@/lib/prisma";

export const revalidate = 5;

export default async function Home() {
  const [slides, categories] = await Promise.all([
    prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.serviceCategory.findMany({ orderBy: { sortOrder: "asc" }, include: { items: { orderBy: { sortOrder: "asc" } } } }),
  ]);

  return (
    <main>
      <section id="home">
        <Hero slides={slides} />
      </section>

      <section id="work">
        <Work />
      </section>

      <section id="working">
        <Working />
      </section>

      <section id="pricing">
        <Pricing categories={categories} />
      </section>

      <section id="footer">
        <Footer />
      </section>
    </main>
  );
}
