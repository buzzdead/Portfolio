import React, { useEffect, useState } from "react";
import axios from 'axios'

const Games = () => {
  const [userData, setUserData] = useState<{personaname: string, avatarfull: string, steamid: number} | null>(null);

  useEffect(() => {
    const apiKey = 'adf'; // Replace with your actual API key

    axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}`)
      .then(response => {
        setUserData(response.data.response.players[0]);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  console.log(userData)
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
