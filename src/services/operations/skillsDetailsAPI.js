import { apiConnector } from "../apiConnector";
import { skillsSectionEndpoints } from "../apis";
import toast from "react-hot-toast";

const {
    GET_USER_SKILLS_DETAILS,
    ADD_NEW_SKILL_DETAIL,
    UPDATE_EXISTING_SKILL_DETAIL,
    TOGGLE_SKILL_DETAIL_VISIBILITY,
    DELETE_SKILL_DETAIL
} = skillsSectionEndpoints;

export async function getUserSkillsDetails() {
    console.log("Getting Skills details");
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    try {
        const response = await apiConnector("GET", GET_USER_SKILLS_DETAILS, {}, {
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

export async function addNewSkillDetail(formData) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Adding New Skill Detail");
    try {
        const response = await apiConnector("POST", ADD_NEW_SKILL_DETAIL, formData, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Added New Skills", {
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

export async function patchSkillDetail(formData, id) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Updating Skill Detail");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_EXISTING_SKILL_DETAIL}${id}`, formData, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Updated Skills", {
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

export async function toggleSkillDetailVisibility(id) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("toggle Skill Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_SKILL_DETAIL_VISIBILITY}${id}/toggle-visibility`, {}, {
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

export async function deleteSkillDetail(id) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Deleting Skill Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_SKILL_DETAIL}${id}`, {}, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Deleted Skills", {
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