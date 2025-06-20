export type User = {
  gender: 'male' | 'female';
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
  registered: {
    date: string;
    age: number;
  };
};
