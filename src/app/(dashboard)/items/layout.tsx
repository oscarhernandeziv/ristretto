import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Items",
  description: "Manage your items and inventory.",
};

interface ItemsLayoutProps {
  children: React.ReactNode;
}

export default function ItemsLayout({ children }: ItemsLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <main className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
