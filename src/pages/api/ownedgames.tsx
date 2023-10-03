import type { NextApiRequest, NextApiResponse } from "next";

type REQ = string | string[] | undefined
export type RecentGameSummary = { appid: number; name: string; playtime_2weeks: number; playtime_forever: number; img_icon_url: string;}

export const getOwnedGames = (key: REQ, id: REQ) => {
  const playersummaries_endpoint = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${id}&include_appinfo=1`;
  return fetch(playersummaries_endpoint, {
    method: "GET",
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { key, steamids, ignoreFilter = false } = req.query;
  const response = await getOwnedGames(key, steamids);

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
  const gamesToRespond = ignoreFilter ? recentGamesSummaries : recentGamesSummaries.filter((e: RecentGameSummary) => e.appid === 546560 || e.appid === 578080)
  return res.status(200).json(
    gamesToRespond
  );
}