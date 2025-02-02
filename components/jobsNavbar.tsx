import React, { useEffect } from "react";

interface IProps {
  step: number;
  setStep: (value: number) => void;
  monthPlan: any;
  yearPlan: any;
  checkedList: Array<object>;
  checkedProduct: Array<object>;
}

export default function AppNavBar({
  setStep,
  step,
  monthPlan,
  yearPlan,
  checkedList,
  checkedProduct,
}: IProps) {
  const linksList = [
    {
      title: "Informacion del puesto",
      stepIndex: 0,
    },
    {
      title: "Secciones del puesto",
      stepIndex: 1,
    },
    {
      title: "Campos",
      stepIndex: 2,
    },
  ];

  const handleStepper = (val: number) => {
    if (monthPlan === null && yearPlan === null) {
      return;
    }
    if (checkedList === null || checkedProduct?.length === 0) {
      return;
    }
    setStep(val);
    localStorage.setItem("navigation", JSON.stringify(val));
  };

  useEffect(() => {
    const navId: any = localStorage.getItem("navigation");
    const parsedNavId = JSON.parse(navId);

    setStep(parsedNavId ? parsedNavId : 0);
  }, [setStep]);

  return (
    <nav className='h-[175px] md:h-full bg-[url("/assets/images/bg-sidebar-mobile.svg")] md:bg-[url("/assets/images/bg-sidebar-desktop.svg")] bg-no-repeat bg-cover p-10 md:rounded-3xl'>
      <div className="flex justify-center md:flex-col gap-8 md:gap-10">
        {linksList.map((linksContent: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-3 cursor-pointer"
            role="button"
            tabIndex={index}
            onClick={() => handleStepper(linksContent.stepIndex)}
          >
            <div
              className={`w-8 md:w-10 h-8 md:h-10 grid place-content-center border border-light-blue ${
                step === linksContent.stepIndex
                  ? "bg-light-blue"
                  : "text-light-blue"
              } font-ubuntu-medium rounded-full`}
            >
              {index + 1}
            </div>
            <div className="hidden md:block">
              <p className="text-light-gray text-xs">Paso {index + 1}</p>
              <p className="text-alabaster font-ubuntu-medium">
                {linksContent.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
