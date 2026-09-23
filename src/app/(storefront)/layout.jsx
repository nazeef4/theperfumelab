import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function StorefrontLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
