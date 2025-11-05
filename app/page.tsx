import Book from "@/components/Book";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Work from "@/components/Work";
import Working from "@/components/Working";


export default function Home() {
  return (
    <main>
      <Hero/>
      <Work/>
      <Book/>
      <Working/>
      <Pricing/>
      <Footer/>
    </main>
  );
}
