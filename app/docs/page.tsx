import { redirect } from "next/navigation";
import { getFirstDoc } from "@/lib/content";

export default async function DocsIndex() {
  const firstDoc = await getFirstDoc();
  redirect(firstDoc?.href ?? "/");
}
