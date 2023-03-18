import { CFooter } from "@coreui/react";
import React from "react";

const TheFooter = () => {
  return (
    <CFooter fixed="false">
      <div>
        <a
          href="https://auto1central.ramcapcloud.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          auto1central.com
        </a>
        <span className="ml-1">&copy; 2022.</span>
      </div>
    </CFooter>
  );
};

export default React.memo(TheFooter);
