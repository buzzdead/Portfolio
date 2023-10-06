import { BoxProps } from "@chakra-ui/react";


export const commonGamesBig: BoxProps = {
    w: "100%",
    px: 20,
    top: 0,
    pos: "absolute",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    flexDir: "column",
    flexWrap: "wrap",
    gap: 1
}
export const commonGamesSmall: BoxProps = {
    w: "100%",
    px: 5,
    pt: 10,
    justifyContent: "center",
    display: "flex",
    flexDir: "row",
    flexWrap: "wrap",
    gap: 10,
}

export const playerCardStyle: BoxProps = {
    display: "flex",
    alignSelf: "flex-end",
    flexDir: "column",
    width: 185
}
