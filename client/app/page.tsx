"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";

interface Props {}

const Page: FC<Props> = (props) => {
  return (
    <div>
      <Heading
        title="ByteEd"
        description="ByteEd is a platform where students will be prepared to face the real world with real skills."
        keywords="Program, Code, Design, Manage, Learn, Share"
      />
    </div>
  );
};

export default Page;
