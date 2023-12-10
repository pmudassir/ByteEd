import React, { FC } from "react";
import Image from "next/image";

type Props = {};

const Hero: FC<Props> = (props) => {
  return (
    <div className="w-full 1000px:flex items-center">
      <div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1100px:h-[600px] 1100px:w-[600px] h-[50vh] w-[50vw] hero-animation rounded-full mx-12">
        <div className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 10000px:pt-[0px] z-10">
          <Image
            src={require("../../../public/assets/Hero.png")}
            alt="Hero"
            className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-auto z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
