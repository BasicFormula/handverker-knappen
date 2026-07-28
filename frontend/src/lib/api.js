import axios from "axios";


const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const fetchDashboard = async () => (await axios.get(`${API}/dashboard`)).data;
export const fetchJobs = async () => (await axios.get(`${API}/jobs`)).data;
export const fetchJob = async (jobId) => (await axios.get(`${API}/jobs/${jobId}`)).data;
export const fetchCraftspeople = async () => (await axios.get(`${API}/craftspeople`)).data;
export const fetchAffiliateProducts = async () => (await axios.get(`${API}/affiliate-products`)).data;
export const fetchEmailTemplates = async () => (await axios.get(`${API}/email/templates`)).data;
export const postJob = async (payload) => (await axios.post(`${API}/jobs`, payload)).data;
export const postOffer = async (jobId, payload) => (await axios.post(`${API}/jobs/${jobId}/offers`, payload)).data;
export const assignCraftsperson = async (jobId, payload) => (await axios.post(`${API}/jobs/${jobId}/assignment`, payload)).data;
export const createContactRequest = async (jobId, payload) => (await axios.post(`${API}/jobs/${jobId}/contact-requests`, payload)).data;
export const fetchAvailableCraftspeople = async (jobId) => (await axios.get(`${API}/jobs/${jobId}/available-craftspeople`)).data;
export const fetchMarketCoverage = async () => (await axios.get(`${API}/market-coverage`)).data;
export const onboardCraftsperson = async (payload) => (await axios.post(`${API}/craftspeople/onboard`, payload)).data;
export const fetchLaunchCampaign = async () => (await axios.get(`${API}/launch-campaign`)).data;