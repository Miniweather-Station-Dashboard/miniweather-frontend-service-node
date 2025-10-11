import { useEffect } from "react";
import { setArticles, setLoading, setError } from "../slices/articleSlice";
import { useAppDispatch } from "./helper";

/**
 * Async function to fetch warning data from the backend.
 * This function dispatches actions to update Redux state based on the API call's status.
 * @param {Function} dispatch - The Redux dispatch function.
 */
export async function fetchArticleData(dispatch) {
    dispatch(setLoading('pending'));
    dispatch(setError(null));

    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/articles?page=1&limit=5&is_published=false`;
        const headers = { 'Content-Type': 'application/json' };

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch warnings');
        }

        const result = await response.json();
        dispatch(setArticles(result.data.articles || []));
        dispatch(setLoading('succeeded'));

    } catch (error) {
        dispatch(setError(error.message || 'An unknown error occurred while fetching warnings.'));
        dispatch(setLoading('failed'));
        console.error("Error in fetchArticleData:", error);
    }
}

/**
 * Custom hook to fetch warning data when the component mounts.
 * It dispatches the action to fetch articles via Redux.
 */
export default function useArticleData() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        fetchArticleData(dispatch);
    }, [dispatch]);
}
