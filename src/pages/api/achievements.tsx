import type { NextApiRequest, NextApiResponse } from "next";
import { REQ } from "../../types";

type Unlocktime = { unlocktime: number }
type GameType =   {game: { availableGameStats: { achievements: any[] }}}
type Achievement = { playerstats: { achievements: any[]; }; }

const fetchFromSteamApi = async (endpoint: string) => {
  const response = await fetch(endpoint, { method: "GET" });
  if (response.status !== 200) throw new Error('Steam API Error');
  return response.json();
};

const getAchievements = (key: REQ, id: REQ, appid: REQ) => {
  const endpoint = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid}&key=${key}&steamid=${id}`;
  return fetchFromSteamApi(endpoint);
};

const getGameSchema = (key: REQ, appid: REQ) => {
  const endpoint = `http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/?key=${key}&appid=${appid}&l=english&format=json`;
  return fetchFromSteamApi(endpoint);
};

function processAchievements(gameSchema: GameType, achievements: Achievement, ignoreFilter: boolean) {
  const completedAchievements = gameSchema?.game?.availableGameStats?.achievements
    ?.map(a => {
      const matchingAchievement = achievements?.playerstats?.achievements?.find(ach => ach.apiname === a.name);
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
        ?.filter((e: Unlocktime) => e.unlocktime > 0)
        ?.sort((a: Unlocktime, b: Unlocktime) => b.unlocktime - a.unlocktime)?.length,
    };
    return achievementProgress;
  }

  const unlockedAchievements = completedAchievements.filter((e: Unlocktime) => e.unlocktime > 0);

  if (unlockedAchievements.length < 10) {
    const lockedAchievements = completedAchievements.filter((e: Unlocktime) => e.unlocktime === 0);
    const unlockedLength = unlockedAchievements.length
    for (let j = 0; j < 10 - unlockedLength; j++) {
      unlockedAchievements.push(lockedAchievements[j]);
    }
  }

  const tenLastAchievements = unlockedAchievements
    .sort((a: Unlocktime, b: Unlocktime) => b.unlocktime - a.unlocktime)
    .slice(0, 10);

  return tenLastAchievements;
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { key, steamids, appid, ignoreFilter = false } = req.query;

  try {
    const achievements = await getAchievements(key, steamids, appid);
    const gameSchema = await getGameSchema(key, appid);

    const processedAchievements = processAchievements(gameSchema, achievements, ignoreFilter as boolean);
    return res.status(200).json(processedAchievements);
  } catch (error) {
    console.error('Error:', error);
    return res.status(200).json({ steam: { personastate: "Offline" } });
  }
}
