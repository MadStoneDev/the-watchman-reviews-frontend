import axios from "axios";

export const getAllReviews = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/reviews`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
