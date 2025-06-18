import { User } from '../types/User';

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch('https://randomuser.me/api/?results=10');
  const json = await res.json();
  return json.results;
};
