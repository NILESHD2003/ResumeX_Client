import { apiConnector } from "../apiConnector";
import { agenticAI_Endpoints } from "../apis";
import { jobIdStore } from "../../stores/jobIdStore";

const {
    SUBMIT_NEW_JOB_REQUEST,
    CHECK_JOB_STATUS
} = agenticAI_Endpoints;

const setJobID = jobIdStore.getState().setJobID;

export async function sumbitNewJobRequest(job) {
    console.log("Submitting a new Job Request");
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);

    try {
      const response = await apiConnector("POST", SUBMIT_NEW_JOB_REQUEST, job, {
        Authorization: `Bearer ${token}`
      });

      if (response.data.success) {
        await setJobID(response.data.jobId);
        console.log(response.data.jobId);
        return response.data.jobId;
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
}

export async function checkJobStatus(jobId) {
    console.log("Checking Job Status");
    const item = localStorage.getItem("authToken");
    const { token, expiry } = JSON.parse(item);
    try {
        const response = await apiConnector("GET", CHECK_JOB_STATUS + jobId, {}, {
            Authorization: `Bearer ${token}`
        })
        if (response.data) {
            console.log(response.data);
            return response.data;
        } else {
            console.log("Error Occured");
        }
    } catch (error) {
        console.log(error);
    }
}