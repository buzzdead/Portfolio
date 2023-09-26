import { AnimatePresence, motion } from "framer-motion";
import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useState } from "react";

const ThemeToggleButton = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const [toggled, setToggled] = useState(false)
  const onToggle = () => {
    toggleColorMode()
    setToggled(true)
    setTimeout(() => setToggled(false), 300)
  }
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        style={{ display: "inline-block"}}
        key={useColorModeValue("light", "dark")}
        initial={{scale: colorMode === 'light' ? 0.8 : 0.4, rotate: colorMode === 'light' ? 180 : -125 }}
        animate={{scale: 1, rotate: 0 }}
        transition={{ duration: 0.4 }}
      >
        <IconButton
          aria-label="Toggle theme"
          size={'md'}
          variant={toggled ? 'unstyled' : 'solid'}
          colorScheme={useColorModeValue("blue", "gray")}
          icon={useColorModeValue(<SunIcon fontSize={'2xl'} color={toggled ? 'yellow.100' : 'yellow.100'}/>, <MoonIcon fontSize={'2xl'} color='white' />)}
          onClick={onToggle}
          cursor={toggled ? 'none' : 'pointer'}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeToggleButton;
