import { HomePage } from "@/components/home-page";
import { db } from "@/db";
import { userFiles, usersTable } from "@/db/schema";

export default async function Home() {
  return (
    <main>
      <HomePage />
    </main>
  );
}
