export interface PlayerInterface {
  _id: string;
  name: string;
  country: string;
  age: number;
  gender: string;
  club: string;
  email: string;
  phone: string;
  photo: string;
  position: string;
}
export interface ClubInterface {
  _id: string;
  name: string;
  country: string;
  level: string;
}

export interface PositionInterface {
  _id: string;
  name: string;
}

export interface UserInterface {
  _id: string;
  role: string;
  username: string;
  email: string;
  password: string;
  password2: string;
  phone: string;
  name: string;
  club: string;
}
