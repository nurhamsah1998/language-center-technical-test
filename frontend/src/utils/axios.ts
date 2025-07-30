import axios from "axios";

const AXIOS = axios.create({
  baseURL: `${import.meta.env.LANGUAGE_CENTER_BASE_URL}/api`,
});

export default AXIOS;
