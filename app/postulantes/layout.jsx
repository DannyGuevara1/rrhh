import NavbarPostulante from "@/components/navbarPostulante";

export default function PostulantesLayout({ children }) {
  return (
    <div>
      <NavbarPostulante />
      <main className="container mx-auto max-w-8xl pt-16 px-6 flex-grow">
        {children}
      </main>
    </div>
  );
}
