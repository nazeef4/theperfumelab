import { getSession } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import Toaster from "@/components/Toaster";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = getSession();
  return (
    <>
      <Toaster />
      {session ? <AdminDashboard username={session.username} /> : <AdminLogin />}
    </>
  );
}
