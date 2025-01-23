"use client";

interface ItemsTemplateProps {
  children: React.ReactNode;
  footer: React.ReactNode;
}

export default function ItemsTemplate({
  children,
  footer,
}: ItemsTemplateProps) {
  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-auto">{children}</main>
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {footer}
      </footer>
    </div>
  );
}
