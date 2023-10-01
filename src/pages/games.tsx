import React, { useEffect, useState } from "react";
import axios from 'axios'

const Games = () => {
  const [userData, setUserData] = useState<{personaname: string, avatarfull: string, steamid: number} | null>(null);

  useEffect(() => {

    axios.get('/api/steamProxy/ISteamUser/GetPlayerSummaries/v2/&steamids=76561197960435530')
      .then(response => {
        console.log(response);
        setUserData(response.data.players[0]);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  if (userData) {
    return (
      <div>
        <h1>Welcome, {userData.personaname}!</h1>
        <img src={userData.avatarfull} alt="Profile" />
        <p>Steam ID: {userData.steamid}</p>
        {/* Display other user data as needed */}
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default Games;
