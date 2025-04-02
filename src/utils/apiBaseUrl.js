const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  if (envUrl) return envUrl;

  const isLocalhost = window?.location.hostname === "localhost";
  return isLocalhost
    ? "http://localhost:5001"
    : "https://interactive-comments-backend.onrender.com";
};

export default getApiBaseUrl;
