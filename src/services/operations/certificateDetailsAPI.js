import { apiConnector } from "../apiConnector";
import { certificatesSectionEndpoints } from "../apis";
import toast from "react-hot-toast";

const {
    GET_USER_CERTIFICATES_DETAILS,
    ADD_NEW_CERTIFICATE_DETAIL,
    UPDATE_EXISTING_CERTIFICATE_DETAIL,
    TOGGLE_CERTIFICATE_DETAIL_VISIBILITY,
    DELETE_CERTIFICATE_DETAIL
} = certificatesSectionEndpoints;

export async function getUserCertificatesDetails() {
    console.log("Getting Certificates details");
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    try {
        const response = await apiConnector("GET", GET_USER_CERTIFICATES_DETAILS, {}, {
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

export async function addNewCertificateDetail(formData) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Adding New Certificate Detail");
    try {
        const response = await apiConnector("POST", ADD_NEW_CERTIFICATE_DETAIL, formData, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Added Certification Details", {
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

export async function patchCertificateDetail(formData, id) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Updating Certificate Detail");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_EXISTING_CERTIFICATE_DETAIL}${id}`, formData, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Updated Certification Details", {
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

export async function toggleCertificateDetailVisibility(id) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("toggle Certificate Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_CERTIFICATE_DETAIL_VISIBILITY}${id}/toggle-visibility`, {}, {
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

export async function deleteCertificateDetail(id) {
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    console.log("Deleting Certificate Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_CERTIFICATE_DETAIL}${id}`, {}, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            toast.success("Deleted Certification Details", {
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