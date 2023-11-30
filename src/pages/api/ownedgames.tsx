import type { NextApiRequest, NextApiResponse } from "next";
import { REQ, RecentGameSummary } from "../../types";

export const getOwnedGames = (key: REQ, id: REQ) => {
  const endpoint = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${id}&include_appinfo=1`;
  return fetch(endpoint, { method: "GET" });
};

const processOwnedGames = (games: RecentGameSummary[], ignoreFilter: boolean) => {
  return ignoreFilter
    ? games
    : games.filter(game => game.appid === 546560 || game.appid === 578080);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { key, steamids, ignoreFilter = false } = req.query;

  try {
    const response = await getOwnedGames(key, steamids);
    if (response.status !== 200) throw new Error('Steam API Error');

    const steam = await response.json();
    if (!steam?.response?.games) throw new Error('No Games Found');

    const recentGamesSummaries: RecentGameSummary[] = steam.response.games;
    const gamesToRespond = processOwnedGames(recentGamesSummaries, ignoreFilter as boolean);
    return res.status(200).json(gamesToRespond);
  } catch (error) {
    console.error('Error:', error);
    return res.status(200).json({ steam: { personastate: "Offline" } });
  }
}
