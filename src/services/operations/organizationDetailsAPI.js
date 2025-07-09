import { apiConnector } from "../apiConnector";
import { organizationsSectionEndpoints } from "../apis";
import toast from "react-hot-toast";

const {
    GET_USER_ORGANIZATIONS_DETAILS,
    ADD_NEW_ORGANIZATION_DETAIL,
    UPDATE_EXISTING_ORGANIZATION_DETAIL,
    TOGGLE_ORGANIZATION_DETAIL_VISIBILITY,
    DELETE_ORGANIZATION_DETAIL
} = organizationsSectionEndpoints;

export async function getUserOrganizationsDetails() {
    console.log("Getting Organizations details");
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    try {
        const response = await apiConnector("GET", GET_USER_ORGANIZATIONS_DETAILS, {}, {
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

export async function addNewOrganizationDetail(formData) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Adding New Organization Detail");
    try {
        const response = await apiConnector("POST", ADD_NEW_ORGANIZATION_DETAIL, formData, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Added Organization Detail", {
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

export async function patchOrganizationDetail(formData, id) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Updating Organization Detail");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_EXISTING_ORGANIZATION_DETAIL}${id}`, formData, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Updated Organization Detail", {
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

export async function toggleOrganizationDetailVisibility(id) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("toggle Organization Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_ORGANIZATION_DETAIL_VISIBILITY}${id}/toggle-visibility`, {}, {
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

export async function deleteOrganizationDetail(id) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Deleting Organization Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_ORGANIZATION_DETAIL}${id}`, {}, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Deleted Organization Detail", {
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