export const metadata = {
  title: "Administrator",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-ivory">{children}</div>;
}
