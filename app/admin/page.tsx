import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import PTMatcher from "@/components/PTMatcher";
import { authOptions } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin");
  }
  return <PTMatcher mode="admin" sessionEmail={session.user?.email ?? ""} />;
}
