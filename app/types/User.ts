export type User = {
  name: {
    first: string;
    last: string;
  };
  email: string;
  picture: {
    thumbnail: string;
    medium: string;
  };
};
