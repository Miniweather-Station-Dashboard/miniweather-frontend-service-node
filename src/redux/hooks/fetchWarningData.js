import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setWarnings, setLoading, setError } from "../slices/warningSlice";

/**
 * Async function to fetch warning data from the backend.
 * This function dispatches actions to update Redux state based on the API call's status.
 * @param {Function} dispatch - The Redux dispatch function.
 */
export async function fetchWarningData(dispatch) {
    dispatch(setLoading('pending'));
    dispatch(setError(null));

    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/warnings`;
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
        dispatch(setWarnings(result.data.warnings || []));
        dispatch(setLoading('succeeded'));

    } catch (error) {
        dispatch(setError(error.message || 'An unknown error occurred while fetching warnings.'));
        dispatch(setLoading('failed'));
        console.error("Error in fetchWarningData:", error);
    }
}

/**
 * Custom hook to fetch warning data when the component mounts.
 * It dispatches the action to fetch warnings via Redux.
 */
export default function useWarningData() {
    const dispatch = useDispatch();

    useEffect(() => {
        fetchWarningData(dispatch);
    }, [dispatch]);
}
