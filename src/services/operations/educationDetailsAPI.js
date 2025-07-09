import axios from "axios";
import { apiConnector } from "../apiConnector";
import { educationalDetailsEndpoints } from "../apis";
import toast from "react-hot-toast";

const {
    GET_USER_EDUCATION_DETAILS,
    ADD_NEW_EDUCATION_DETAIL,
    UPDATE_EXISTING_EDUCATION_DETAIL,
    TOGGLE_EDUCATION_DETAIL_VISIBILITY,
    DELETE_EDUCATION_DETAIL,
} = educationalDetailsEndpoints;

export async function getUserEducationDetails() {
    console.log("Getting Education details");
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    try {
        const response = await axios.get(GET_USER_EDUCATION_DETAILS, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data.success) {
            console.log(response.data.message);
            return response.data.data;
        } else {
            console.log(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
}

export async function addNewEducationDetails(formData) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Adding New Education Detail");
    try {
        const response = await apiConnector("POST", ADD_NEW_EDUCATION_DETAIL, formData, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Added Education Details", {
                duration: 5000,
                style: {
                    border: '1px solid rgba(47, 200, 122, 0.5)',
                    backgroundColor: 'rgba(47, 200, 122, 0.1)', // Light background version
                    color: '#2fc87a'
                }
            })
            return response.data.data;
        } else {
            console.log(response.data.message)
        }
    } catch (error) {
        console.log(error)
        toast.error(errorMessage, {
            style: {
                border: '1px solid rgba(251, 44, 54, 0.5)',
                backgroundColor: 'rgba(251, 44, 54, 0.1)',
                color: '#fb2c36'
            }
        });
    }
}

export async function patchEducationDetail(formData, id) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Updating Education Detail");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_EXISTING_EDUCATION_DETAIL}${id}`, formData, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Updated Education Details", {
                duration: 5000,
                style: {
                    border: '1px solid rgba(47, 200, 122, 0.5)',
                    backgroundColor: 'rgba(47, 200, 122, 0.1)', // Light background version
                    color: '#2fc87a'
                }
            })
        } else {
            console.log(response.data.message)
        }
    } catch (error) {
        console.log(error)
        toast.error(errorMessage, {
            style: {
                border: '1px solid rgba(251, 44, 54, 0.5)',
                backgroundColor: 'rgba(251, 44, 54, 0.1)',
                color: '#fb2c36'
            }
        });
    }
}

export async function toggleEducationDetailVisibility(id) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("toggle Education Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_EDUCATION_DETAIL_VISIBILITY}${id}/toggle-visibility`, {}, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
        } else {
            console.log(response.data.message)
        }
    } catch (error) {
        console.log(error)
    }
}

export async function deleteEducationDetail(id) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Deleting Education Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_EDUCATION_DETAIL}${id}`, {}, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Deleted Education Details", {
                duration: 5000,
                style: {
                    border: '1px solid rgba(47, 200, 122, 0.5)',
                    backgroundColor: 'rgba(47, 200, 122, 0.1)', // Light background version
                    color: '#2fc87a'
                }
            })
        } else {
            console.log(response.data.message)
        }
    } catch (error) {
        console.log(error);
        toast.error(errorMessage, {
            style: {
                border: '1px solid rgba(251, 44, 54, 0.5)',
                backgroundColor: 'rgba(251, 44, 54, 0.1)',
                color: '#fb2c36'
            }
        });
    }
}