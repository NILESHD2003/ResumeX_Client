import { apiConnector } from "../apiConnector";
import { projectsSectionEndpoints } from "../apis";
import toast from "react-hot-toast";

const {
    GET_USER_PORJECTS_DETAILS,
    ADD_NEW_PROJECT_DETAIL,
    UPDATE_EXISTING_PROJECT_DETAIL,
    TOGGLE_PROJECT_DETAIL_VISIBILITY,
    DELETE_PROJECT_DETAIL
} = projectsSectionEndpoints;

export async function getUserProjectsDetails() {
    console.log("Getting Projects details");
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    try {
        const response = await apiConnector("GET", GET_USER_PORJECTS_DETAILS, {}, {
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

export async function addNewProjectDetail(formData) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Adding New Project Detail");
    try {
        const response = await apiConnector("POST", ADD_NEW_PROJECT_DETAIL, formData, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Added Project Details", {
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

export async function patchProjectDetail(formData, id) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Updating Project Detail");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_EXISTING_PROJECT_DETAIL}${id}`, formData, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Updated Project Details", {
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

export async function toggleProjectDetailVisibility(id) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("toggle Project Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_PROJECT_DETAIL_VISIBILITY}${id}/toggle-visibility`, {}, {
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

export async function deleteProjectDetail(id) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Deleting Project Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_PROJECT_DETAIL}${id}`, {}, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Deleted Project Details", {
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