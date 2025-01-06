import { AuthHeader } from "@/components/layout/header/auth-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthHeader />
      {children}
    </>
  );
}
