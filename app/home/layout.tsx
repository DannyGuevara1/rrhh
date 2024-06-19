import { Link } from "@nextui-org/link";

import { Navbar } from "@/components/navbar";
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://github.com/DannyGuevara1?tab=overview&from=2024-06-01&to=2024-06-02"
          title="profile github"
        >
          <span className="text-default-600">Created by</span>
          <p className="text-primary">DannyGuevara1</p>
        </Link>
      </footer>
    </>
  );
}
