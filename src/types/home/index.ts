export interface HomeQuery {
  lat: number;
  lon: number;
}

export interface HomeResponse {
  userId: number;
  nickname: string;
  scene: string;
  achievementRate: number;
  temp: number;
  daysRemaining: number;
  wellnessTip: string;
}
