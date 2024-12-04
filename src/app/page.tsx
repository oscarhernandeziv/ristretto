import { Dashboard } from "@/components/dashboard-01";

export default function Home() {
  console.log(process.env.DATABASE_URL);
  return <Dashboard />;
}
