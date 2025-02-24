import axiosClient from "./axiosClient";

const END_POINTS = {
    GET_INGREDIENTS: "admin/ingredients",
};

export const getAdminIngredients = async () => {
    try {
        const url = `${END_POINTS.GET_INGREDIENTS}`;
        const response = await axiosClient.get(url);
        console.log("Fetched ingredients:", response); // Log full response
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
