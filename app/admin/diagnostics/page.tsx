import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuth } from "@/lib/session";
import { Diagnostics } from "@/components/admin/diagnostics";

export const metadata = {
  title: "Diagnostics | Admin Panel",
  description: "System diagnostics and monitoring",
};

export default async function DiagnosticsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    redirect("/login");
  }

  const user = await verifyAuth(token);
  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="container py-8">
      <Diagnostics />
    </div>
  );
}