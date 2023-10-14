import type { NextApiRequest, NextApiResponse } from "next";
import { REQ } from "../../types";

export const getAchievements = (key: REQ, id: REQ, appid: REQ) => {
  const playersummaries_endpoint = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid}&key=${key}&steamid=${id}`;
  return fetch(playersummaries_endpoint, {
    method: "GET",
  });
};
const getGameSchema = (key: REQ, appid: REQ) => {
  const playersummaries_endpoint2 = `http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/?key=${key}&appid=${appid}&l=english&format=json`;
  return fetch(playersummaries_endpoint2, {
    method: "GET",
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { key, steamids, appid, ignoreFilter = false } = req.query;
  const response = await getAchievements(key, steamids, appid);

  const gameSchemaResponse = await getGameSchema(key, appid);

  if (response.status != 200) {
    return res.status(200).json({
      steam: {
        personastate: "Offline",
      },
    });
  }

  if (gameSchemaResponse.status != 200) {
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

  const completedAchievements =
    gameSchema?.game?.availableGameStats?.achievements
      ?.map((a: any) => {
        const matchingAchievement =
          achivements?.playerstats?.achievements?.find(
            (ach: any) => ach.apiname === a.name
          );

        if (matchingAchievement) {
          return {
            ...a,
            unlocktime: matchingAchievement.unlocktime,
          };
        }

        return null;
      })
      .filter(Boolean);

  if (ignoreFilter) {
    const achievementProgress = {
      total: completedAchievements?.length || 0,
      achieved: completedAchievements
        ?.filter((e: any) => e.unlocktime > 0)
        ?.sort(
          (a: { unlocktime: number }, b: { unlocktime: number }) =>
            b.unlocktime - a.unlocktime
        )?.length,
    };
    return res.status(200).json(achievementProgress);
  }

  const unlockedAchievements = completedAchievements.filter((e: any) => e.unlocktime > 0);

// If there are less than 10 unlocked achievements, add locked achievements
if (unlockedAchievements.length < 10) {
  const lockedAchievements = completedAchievements.filter((e: any) => e.unlocktime === 0);
  const unlockedLength = unlockedAchievements.length
  for(var j = 0; j < 10 - unlockedLength; j++) unlockedAchievements.push(lockedAchievements[j])
}

const tenLastAchievements = unlockedAchievements
  .sort((a: { unlocktime: number }, b: { unlocktime: number }) => b.unlocktime - a.unlocktime)
  .slice(0, 10);

return res.status(200).json(tenLastAchievements);

}
