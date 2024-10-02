import axios from "axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/auth/local`,
      {
        identifier: email,
        password,
      },
    );

    const user = response.data.user;
    const token = response.data.jwt;
  } catch (error) {
    console.log(error);
  }
};

export const register = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/auth/local/register`,
      {
        username,
        email,
        password,
      },
    );

    const user = response.data.user;
    const token = response.data.jwt;

    localStorage.setItem("jwt", token);
  } catch (error) {
    console.log(error);
  }
};
