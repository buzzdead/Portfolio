import type { NextApiRequest, NextApiResponse } from "next";
import { Achivement } from "./achievements";

type REQ = string | string[] | undefined
export type RecentGameSummary = { appid: number; name: string; playtime_2weeks: number; playtime_forever: number; img_icon_url: string;}

export const getRecentGames = (key: REQ, id: REQ) => {
  const playersummaries_endpoint = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${key}&steamid=${id}`;
  return fetch(playersummaries_endpoint, {
    method: "GET",
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { key, steamids } = req.query;
  const response = await getRecentGames(key, steamids);

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
  const recentGamesSummaries: RecentGameSummary[] = steam.response.games
  return res.status(200).json(
    recentGamesSummaries
  );
}