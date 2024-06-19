import NavbarAdmin from "../../components/navbarAdmin";

export default function DashboardLayout({ children }) {
  return (
    <>
      <NavbarAdmin />
      <main className="container mx-auto max-w-8xl pt-6 px-6 flex-grow">
        {children}
      </main>
    </>
  );
}
