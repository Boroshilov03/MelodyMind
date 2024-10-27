// acces token

const client_id = '9c0464258e4e49549ce8066ea3a06875';
const client_secret = '1750fae5a6764fe4942cb7727109cc72';
const redirect_uri = 'http://localhost:3000/recs';

export const fetchAccessToken = async (code) => {
  const params = new URLSearchParams();
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);
  params.append("grant_type", "authorization_code");

  const authHeader =
    "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authHeader,
      },
      body: params.toString(),
    });

    if (!response.ok) throw new Error("Failed to fetch access token");

    const data = await response.json();
    return data.access_token;
  } 
  
  catch (error) {
    console.error("Error fetching access token:", error);
    throw error; 
  }
};

export const fetchRefreshToken = async () => {

  // refresh token that has been previously stored
  const refreshToken = localStorage.getItem('refresh_token');
  const url = "https://accounts.spotify.com/api/token";

   const payload = {
     method: 'POST',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     body: new URLSearchParams({
       grant_type: 'refresh_token',
       refresh_token: refreshToken,
       client_id: client_id
     }),
   }
   const body = await fetch(url, payload);
   const response = await body.json();

   localStorage.setItem('access_token', response.accessToken);
   if (response.refreshToken) {
     localStorage.setItem('refresh_token', response.refreshToken);
   }
 }
