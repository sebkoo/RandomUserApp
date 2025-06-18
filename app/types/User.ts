export type User = {
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  phone: string;
  dob: {
    date: string; // ISO string
    age: number;
  };
  location: {
    city: string;
    country: string;
  };
  picture: {
    thumbnail: string;
    medium: string;
    large: string;
  };
};
