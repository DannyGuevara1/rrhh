export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br px-4 py-12 from-teal-400 to-yellow-200  dark:from-[#7928CA] dark:to-[#FF0080] ">
      {children}
    </section>
  );
}
