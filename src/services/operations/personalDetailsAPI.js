import { apiConnector } from "../apiConnector";
import { personalDetailsEndpoints } from "../apis";
import axios from "axios";
import toast from "react-hot-toast";

const {
    GET_USER_PERSONAL_DETAILS,
    UPDATE_USER_PERSONAL_DETAILS
} = personalDetailsEndpoints;

export async function getPersonalDetails() {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    try {
        const response = await axios.get(GET_USER_PERSONAL_DETAILS, {
            headers: {
            Authorization: `Bearer ${token}`,
        }
    })
        if (response.data.success) {
            console.log("Data fetched successfully");
            return response.data.data;
        }
    } catch (error) {
        console.log("Data not fetchable...", error)
    }
}

export async function patchPersonalDetails(formData) {
    console.log(formData)
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    try {
        const response = await apiConnector("PATCH", UPDATE_USER_PERSONAL_DETAILS, formData, {
            Authorization: `Bearer ${token}`,
        })
        if (response.data.success) {
            console.log("Saved")
            toast.success("Saved Personal Details", {
                duration: 5000,
                style: {
                    border: '1px solid rgba(47, 200, 122, 0.5)',
                    backgroundColor: 'rgba(47, 200, 122, 0.1)', // Light background version
                    color: '#2fc87a'
                }
            })
        }
    } catch (error) {
        console.log("Data was not updated", error)
        const errorMessage = error?.response?.data?.message || "Something went wrong"
        toast.error(errorMessage, {
            style: {
                border: '1px solid rgba(251, 44, 54, 0.5)',
                backgroundColor: 'rgba(251, 44, 54, 0.1)',
                color: '#fb2c36'
            }
        });
    }
}