import { User } from '../types/User';

export type RootStackParamList = {
  UserList: undefined;
  UserDetail: { user: User };
};
