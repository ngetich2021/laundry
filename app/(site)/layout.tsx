// app/(site)/layout.tsx
import Nav from "@/components/Nav";
import Sticky from "@/components/Sticky";
import VisitTracker from "@/components/site/visit-tracker";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <VisitTracker />
      <Nav />
      {children}
      <Sticky />
    </div>
  );
}
