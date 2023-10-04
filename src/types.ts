export type REQ = string | string[] | undefined;

export type Achivement = {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  unlocktime: number;
};

export type RecentGameSummary = {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
};

export type PlayerSummary = { 
  personaName: string; 
  avatar: string; 
  status: string; 
  activeGame: string | boolean; 
  profileUrl: string 
}
