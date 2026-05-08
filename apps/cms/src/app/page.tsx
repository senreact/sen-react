import { redirect } from "next/navigation";

// CMS host has no public surface — bounce / to /admin.
export default function Page(): never {
  redirect("/admin");
}
