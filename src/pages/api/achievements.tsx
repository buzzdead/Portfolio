import type { NextApiRequest, NextApiResponse } from "next";

type REQ = string | string[] | undefined
export type Achivement = { name: string; displayName: string; description: string; icon: string; unlocktime: number }

export const getAchievements = (key: REQ, id: REQ, appid: REQ) => {
  const playersummaries_endpoint = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid}&key=${key}&steamid=${id}`;
  return fetch(playersummaries_endpoint, {
    method: "GET",
  });
};
const getGameSchema = (key: REQ, appid: REQ) => {
  const playersummaries_endpoint2 = `http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/?key=${key}&appid=${appid}&l=english&format=json`
  return fetch(playersummaries_endpoint2, {
    method: "GET",
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { key, steamids, appid } = req.query;
  const response = await getAchievements(key, steamids, appid);
  const gameSchemaResponse = await getGameSchema(key, appid);

  if (response.status != 200) {
    return res.status(200).json({
      steam: {
        personastate: "Offline",
      },
    });
  }

  const achivements = await response.json();
  const gameSchema = await gameSchemaResponse.json();
  if (achivements.item === null) {
    return res.status(200).json({
      steam: {
        personastate: "Offline",
      },
    });
  }
  const filteredAchivements2 = gameSchema.game.availableGameStats.achievements.map((a: any) => {
    const matchingAchievement = achivements.playerstats.achievements.find((ach: any) => ach.apiname === a.name);
  
    if (matchingAchievement) {
      return {
        ...a,
        unlocktime: matchingAchievement.unlocktime
      };
    }
  
    return null;
  }).filter(Boolean);

  const filteredAchivements: Achivement[] = filteredAchivements2.filter((e: any) => e.unlocktime > 0).sort((a: { unlocktime: number; }, b: { unlocktime: number; }) => b.unlocktime - a.unlocktime).slice(0, 10); 
  return res.status(200).json(
    filteredAchivements
  );
}