import axios from "axios";
import { apiConnector } from "../apiConnector";
import { profileSummaryEndpoints } from "../apis";
import toast from "react-hot-toast";

const {
    GET_USER_PROFILE_SUMMARY,
    UPDATE_USER_PROFILE_SUMMARY,
    TOGGLE_USER_PROFILE_SUMMARY_VISIBILITY
} = profileSummaryEndpoints;

export async function getProfileSummaryDetails() {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    try {
        const response = await axios.get(GET_USER_PROFILE_SUMMARY,  {
            headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    if (response.data.success) {
        console.log(response.data.data);
        return response.data.data;
    } else {
        console.log(response.data.message);
    }
    } catch (error) {
        console.log("Data was not fetched", error);
    }
}

export async function patchProfileSummaryDetails(summary) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    try {
        const response = await apiConnector("PATCH", UPDATE_USER_PROFILE_SUMMARY, {
            "summary": summary
        }, {
            Authorization: `Bearer ${token}`,
        })
        if (response.data.success) {
            toast.success("Saved Profile Summary", {
                duration: 5000,
                style: {
                    border: '1px solid rgba(47, 200, 122, 0.5)',
                    backgroundColor: 'rgba(47, 200, 122, 0.1)', // Light background version
                    color: '#2fc87a'
                }
            })
        } else {
            console.log(response.data.message);
        }
    } catch(error) {
        toast.error(errorMessage, {
            style: {
                border: '1px solid rgba(251, 44, 54, 0.5)',
                backgroundColor: 'rgba(251, 44, 54, 0.1)',
                color: '#fb2c36'
            }
        });
    }
}