import React from "react";
import { HappyProvider } from "@ant-design/happy-work-theme";
import { Button } from "antd";

const Btn = () => {
  return (
    <HappyProvider>
      <Button type="primary">Click Me</Button>
    </HappyProvider>
  );
};

export default Btn;
