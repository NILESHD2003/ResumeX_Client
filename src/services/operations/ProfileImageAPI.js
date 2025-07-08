import { apiConnector } from "../apiConnector";
import { profileImageEndpoints } from "../apis";
import toast from "react-hot-toast";

const {
    GET_USER_PROFILE_IMAGE,
    UPDATE_USER_PROFILE_IMAGE,
    DELETE_USER_PROFILE_IMAGE,
    TOGGLE_USER_PROFILE_IMAGE_VISIBILITY
} = profileImageEndpoints;

export async function getUserProfileImage() {
    console.log("Getting Profile Image");
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    try {
        const response = await apiConnector("GET", GET_USER_PROFILE_IMAGE, {}, {
            Authorization: `Bearer ${token}`
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

export async function patchProfileImage(formData) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Adding New Profile Image");
    try {
        const response = await apiConnector("PATCH", UPDATE_USER_PROFILE_IMAGE, formData, {
            Authorization: `Bearer ${token}`,
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Added Profile Image", {
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

export async function toggleProfileImageVisibility() {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("toggle Profile Image visibility");
    try {
        const response = await apiConnector("PATCH", TOGGLE_USER_PROFILE_IMAGE_VISIBILITY, {}, {
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

export async function deleteProfileImage() {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Deleting Profile Image");
    try {
        const response = await apiConnector("DELETE", DELETE_USER_PROFILE_IMAGE, {}, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Deleted Profile Image", {
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