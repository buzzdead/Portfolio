import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  Input,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import PlayerCard from "./playercard";
import { PlayerSummary } from "../../pages/api/playersummaries";
import { useState } from "react";
import { RecentGameSummary } from "../../pages/api/recentgames";
const steam_default = require("../../../public/images/steam_default.webp");

interface Props {
  playerSummary: PlayerSummary;
}

type CommonGame = Partial<RecentGameSummary> & {
  myProgress?: { achieved: number; total: number };
  opponentProgress?: { achieved: number; total: number };
};
export const GameMatcher = ({ playerSummary }: Props) => {
  const defaultProfile = {
    personaName: "",
    profileUrl: "",
    avatar: steam_default.default.src,
  };
  const [mySteamdId, setMySteamId] = useState("76561198070961718");
  const [opponentSteamId, setOpponentSteamId] = useState("");
  const [loading, setLoading] = useState(false)
  const [myProfile, setMyProfile] = useState({
    personaName: playerSummary.personaName,
    profileUrl: playerSummary.profileUrl,
    avatar: playerSummary.avatar,
  });
  const [opponentProfile, setOpponentProfile] = useState({
    ...defaultProfile,
  });
  const [skipAchievement, setSkipAchievement] = useState(true)
  const [commonGames, setCommonGames] = useState<CommonGame[]>([]);
  const [errorState, setErrorState] = useState<
    { type: "left" | "right" | 'invalid'; message: string }[]
  >([]);
  const [customApi, setCustomApi] = useState("")
  const apiKey = customApi === "" ? process.env.NEXT_PUBLIC_STEAM_API_KEY : customApi
  const [isLargerThan1000] = useMediaQuery("(min-width: 1000px)");

  const fetchOpponentProfile = async () => {
    const fetchString = `/api/playersummaries?key=${apiKey}&steamids=${opponentSteamId}`;
    try {
      const newOpponentProfile = await fetch(fetchString).then((res) =>
        res.json()
      );

      if (newOpponentProfile?.steam?.personastate === "Offline") {
        setOpponentProfile(defaultProfile);
        !errorState.find((e) => e.type === "right") &&
          setErrorState([
            ...errorState,
            { type: "right", message: "API key or Steam ID wrong" },
          ]);
      } else if (
        newOpponentProfile.personaName !== opponentProfile.personaName
      ) {
        setOpponentProfile(newOpponentProfile);
        
        setErrorState(errorState.filter((e) => e.type !== "right" && e.type !== 'invalid'));
      }
    } catch (error) {
      setOpponentProfile(defaultProfile);
      !errorState.find((e) => e.type === "right") &&
        setErrorState([
          ...errorState,
          { type: "right", message: "API key or Steam ID wrong" },
        ]);
    }
    setCommonGames([]);
  };

  const fetchMyProfile = async () => {
    const fetchString = `/api/playersummaries?key=${apiKey}&steamids=${mySteamdId}`;
    try {
      const newMyProfile = await fetch(fetchString).then((res) => res.json());
      if (newMyProfile?.steam?.personastate === "Offline") {
        setMyProfile(defaultProfile);
        !errorState.find((e) => e.type === "left") &&
          setErrorState([
            ...errorState,
            { type: "left", message: "API key or Steam ID wrong" },
          ]);
      } else if (myProfile.personaName !== newMyProfile.personaName) {
        setMyProfile(newMyProfile);
        setErrorState(errorState.filter((e) => e.type !== "left" && e.type !== 'invalid'));
      }
    } catch (error) {
      setMyProfile(defaultProfile);
      !errorState.find((e) => e.type === "left") &&
        setErrorState([
          ...errorState,
          { type: "left", message: "API key or Steam ID wrong" },
        ]);
    }
        setCommonGames([]);
  };
  const fetchGamesInCommon = async () => {
    setLoading(true)
    try {
      const fetchMyGames = `/api/ownedgames?key=${apiKey}&steamids=${mySteamdId}&ignoreFilter=1`;
      const fetchOpponentGames = `/api/ownedgames?key=${apiKey}&steamids=${opponentSteamId}&ignoreFilter=1`;
      const myGames = await fetch(fetchMyGames).then((res) => res.json());
      const opponentGamesResponse = await fetch(fetchOpponentGames);
      const opponentGames = opponentGamesResponse.ok
        ? await opponentGamesResponse.json()
        : [];

      const cGames = mySteamdId === opponentSteamId ? myGames : myGames.filter((game: any) =>
        opponentGames.some((game2: any) => game2.appid === game.appid)
      );

      const extendedGamesPromises = skipAchievement ? cGames : cGames.map(
        async (game: CommonGame): Promise<CommonGame> => {
          const fetchMyProgress = `/api/achievements?key=${apiKey}&steamids=${mySteamdId}&appid=${game.appid}&ignoreFilter=1`;
          const fetchOpponentProgress = `/api/achievements?key=${apiKey}&steamids=${opponentSteamId}&appid=${game.appid}&ignoreFilter=1`;

          const myProgress = await fetch(fetchMyProgress).then((res) =>
            res.json()
          );
          const opponentProgress = await fetch(fetchOpponentProgress).then(
            (res) => res.json()
          );

          return {
            name: game.name,
            myProgress: myProgress,
            opponentProgress: opponentProgress,
          };
        }
      );

      const extendedGames = await Promise.all(extendedGamesPromises);
      setCommonGames(extendedGames);
    } catch (error) {
      console.error("Error fetching games:", "profile not open");
      setErrorState([...errorState, {type: 'invalid', message: 'Something went wrong'}])
      // Handle the error gracefully, e.g., display a message to the user
    }
    setLoading(false)
  };

  const renderOnBig = () => {
    return isLargerThan1000 ? (
      <Box pos="relative" alignItems={"center"} w="100%">
        <Box
          w="100%"
          px={20}
          top={ 0}
          pos={"absolute"}
          justifyContent={"center"}
          display="flex"
          alignItems={"center"}
          flexDir={"column"}
          flexWrap={"wrap"}
          gap={1}
        >
          {commonGames &&
            commonGames.map((e: any, id) => (
              <Box color={id % 2 === 0 ? "red" : "green"} p={2} key={id}>
                {e.myProgress?.achieved}/{e.myProgress?.total} {e.name}{" "}
                {e.opponentProgress?.achieved}/{e.opponentProgress?.total}
              </Box>
            ))}
        </Box>
      </Box>
    ) : null;
  };
  const renderOnSmall = () => {
    return isLargerThan1000 ? null : (
      <Box
        w="100%"
        px={5}
        pt={10}
        justifyContent={"center"}
        display="flex"
        flexDir={"row"}
        flexWrap={"wrap"}
        gap={10}
      >
        {commonGames &&
          commonGames.map((e: CommonGame, id) => (
            <Box color={id % 2 === 0 ? "red" : "green"} p={2} key={id}>
              {e.myProgress?.achieved}/{e.myProgress?.total} {e.name}{" "}
              {e.opponentProgress?.achieved}/{e.opponentProgress?.total}
            </Box>
          ))}
      </Box>
    );
  };

  return (
    <Box display="flex" flexDir={"column"} pb={10}>
        <Box display='flex' flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
        (Må være venn på steam... Legg meg til eller test med egen API her:)
        <FormLabel style={{paddingTop: 5, color: 'green'}}>Steam API nøkkel</FormLabel>
        <Input borderColor={useColorModeValue("black", "white")} value={customApi} onChange={(e) => setCustomApi(e.target.value)} width={'md'}></Input>
        </Box>
      <Box display="flex" justifyContent={"space-between"}>
        <Box
          display="flex"
          alignSelf={"flex-start"}
          flexDir={"column"}
          width={185}
        >
          <PlayerCard playerSummary={myProfile} />
          <Input
            onChange={(e) => setMySteamId(e.target.value)}
            value={mySteamdId}
            width={185}
          />
          <Button bgColor="red" size="lg" onClick={fetchMyProfile}>
            Fetch
          </Button>
        </Box>
        {renderOnBig()}
        <Box
          display="flex"
          alignSelf={"flex-end"}
          flexDir={"column"}
          width={185}
        >
          <PlayerCard playerSummary={opponentProfile} />
          <Input
            onChange={(e) => setOpponentSteamId(e.target.value)}
            value={opponentSteamId}
            width={185}
          />
          <Button bgColor="red" size="lg" onClick={fetchOpponentProfile}>
            Fetch
          </Button>
        </Box>
      </Box>

      <Box display={"flex"} justifyContent={"center"}>
        {commonGames.length === 0 &&
          opponentProfile.personaName !== "" &&
          errorState.length === 0 && (
            <Box display={'flex'} flexDir={'column'} justifyContent={'center'} gap={1}>
                <Box display='flex' flexDir={'row'} justifyContent={'center'} gap={2}>
                <FormLabel p={0} m={0}>Skip achievements</FormLabel>
            <Checkbox size={'lg'} defaultChecked={skipAchievement} checked={skipAchievement} onChange={() => setSkipAchievement(!skipAchievement)}/>
            </Box>
            <Button isLoading={loading} onClick={fetchGamesInCommon} bgColor="green" width={200}>
              GO
            </Button>
            </Box>
          )}
        {errorState.length > 0 && (
          <Box display="flex" flexDir={"column"}>
            {" "}
            {errorState.map((es, id) => (
              <Box key={id}>
                {es.type} {es.type !== 'invalid' && "profile"}: {es.message}
              </Box>
            ))}{" "}
          </Box>
        )}
      </Box>
      {renderOnSmall()}
    </Box>
  );
};
