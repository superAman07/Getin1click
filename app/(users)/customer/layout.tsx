import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}