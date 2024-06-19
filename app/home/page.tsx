/* eslint-disable prettier/prettier */
import { Link } from "@nextui-org/link";
// import { Snippet } from "@nextui-org/snippet";
// import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
// import { GithubIcon } from "@/components/icons";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Ve el mundo con&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>Claridad&nbsp;</h1>
        <br />
        <h1 className={title()}>
          y estilo sin importar tu vision actual.
        </h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Óptica innovadora, rápida y moderna para tu mejor visión.
        </h2>
      </div>

      <div className="flex gap-3">
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href="/home/docs"
        >
          Trabaja con nosotros
        </Link>
      </div>

      {/* <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="flat">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div> */}
    </section>
  );
}
