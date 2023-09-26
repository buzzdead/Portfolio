import React, { useState, useEffect } from "react";
import Scramble from "react-scramble";
import Cookies from "js-cookie";

interface Props {
  text: string;
}

export const Scrambler = ({ text }: Props) => {
  const [hasScrambled, setHasScrambled] = useState(
    Cookies.get("hasScrambled") === "true"
  );

  useEffect(() => {
    if (!hasScrambled) {
      Cookies.set("hasScrambled", "true");
    }
  }, [hasScrambled]);

  if (!hasScrambled) {
    return (
      <Scramble
        text={text}
        autoStart
        speed="fast"
        steps={[
          {
            roll: 1,
            action: "-",
            type: "forward",
          },
          {
            action: "-",
            type: "forward",
            roll: 75,
          },
        ]}
      />
    );
  }

  return <span>{text}</span>;
};
