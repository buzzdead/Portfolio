import type { NextApiRequest, NextApiResponse } from "next";
import { REQ, RecentGameSummary } from "../../types";

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
  //Filtering out apps that's irrelevant
  const recentGamesSummaries: RecentGameSummary[] = steam.response.games.filter((e: any) => e.appid !== 250820 && e.appid !== 719950 && e.appid !== 1408230)
  return res.status(200).json(
    recentGamesSummaries
  );
}