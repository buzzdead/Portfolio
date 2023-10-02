import type { NextApiRequest, NextApiResponse } from "next";

type REQ = string | string[] | undefined
export type PlayerSummary = { personaName: string; avatar: string; status: string; activeGame: string | boolean; profileUrl: string }

export const getPlayerSummaries = (key: REQ, id: REQ) => {
  const playersummaries_endpoint = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${id}`;
  return fetch(playersummaries_endpoint, {
    method: "GET",
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { key, steamids } = req.query;
  const response = await getPlayerSummaries(key, steamids);

  if (response.status != 200) {
    return res.status(200).json({
      steam: {
        personastate: "Offline",
      },
    });
  }

  const steam = await response.json();
  if (steam.item === null) {
    return res.status(200).json({
      steam: {
        personastate: "Offline",
      },
    });
  }

  const getStatus =
    steam.response.players[0].personastate === 1
      ? "Online 😆"
      : steam.response.players[0].personastate === 2
      ? "Busy 😐"
      : steam.response.players[0].personastate === 3
      ? "Away 🥱"
      : "Offline 😴";
  
  const getGames = !steam.response.players[0].gameextrainfo
    ? false
    : `Playing - ${steam.response.players[0].gameextrainfo} 😆`;
    const playerSummary: PlayerSummary = {personaName: steam.response.players[0].personaname, avatar: steam.response.players[0].avatarfull, status: getStatus, activeGame: getGames, profileUrl: steam.response.players[0].profileurl}
  return res.status(200).json(
    playerSummary
  );
}
