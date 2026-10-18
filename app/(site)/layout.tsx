// app/(site)/layout.tsx
import Nav from "@/components/Nav";
import Sticky from "@/components/Sticky";
import { LocalBusinessJsonLd } from "@/components/site/structured-data";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <LocalBusinessJsonLd />
      <Nav />
      {children}
      <Sticky />
    </div>
  );
}
