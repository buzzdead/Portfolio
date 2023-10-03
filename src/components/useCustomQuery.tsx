import { useQuery } from "react-query";


export const useCustomQuery = (type: 'recentGames' | 'playerSummary' | 'ownedGames') => {
    const apiKey = process.env.NEXT_PUBLIC_STEAM_API_KEY;
    const steamId = "76561198070961718";
    const fetchString = type === 'playerSummary' ? `/api/playersummaries?key=${apiKey}&steamids=${steamId}` : type === 'recentGames' ? `/api/recentgames?key=${apiKey}&steamids=${steamId}` : `/api/ownedgames?key=${apiKey}&steamids=${steamId}` 

    const fetchData = async () => {
        const data = await fetch(fetchString).then((res) => res.json())
        return data
    }

    const { data, isLoading, isError  } = useQuery(
        [type, apiKey, steamId],
        fetchData,
        {
          staleTime: 600000,
        }
      );
      return { data, isLoading, isError }
}