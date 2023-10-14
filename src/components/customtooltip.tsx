import { Tooltip, Image, Box } from "@chakra-ui/react";
import { useState } from "react";

interface Props {
  achievement: {
    name: string;
    unlocktime: number;
    displayName: string;
    description: string;
    icon: string;
  };
}

export const CustomToolTip = ({ achievement }: Props) => {
  const { name, unlocktime, displayName, description, icon } = achievement;
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Tooltip
      key={name}
      openDelay={250}
      isOpen={isOpen}
      label={
        <Box  style={{ display: "flex", flexDirection: "row", gap: 15 }}>
          <Image width={"85px"} height={"85px"} src={icon} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p>{displayName}</p>{" "}
            <p>{unlocktime === 0 ? 'Not yet unlocked' : "Unlocked: " + new Date(unlocktime * 1000).toDateString()}</p>
            <p>{description}</p>
          </div>
        </Box>
      }
    >
      <Image userSelect={'none'} onClick={() => setIsOpen(true)}  onTouchCancelCapture={() => setIsOpen(false)} onMouseLeave={() => setIsOpen(false)} onMouseEnter={() => setIsOpen(true)} width={30} src={icon} />
    </Tooltip>
  );
};
