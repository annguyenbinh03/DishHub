import axiosClient from './axiosClient';

const END_POINTS = {
    GET_TABLES: 'restaurants/tables',
    };

export const getTables = async (token) => {
    const url = `${END_POINTS.GET_TABLES}`;
    return axiosClient.get(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}