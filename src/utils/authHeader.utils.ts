export default function authHeader() {
    const persistedData = JSON.parse(localStorage.getItem('persist:root') as string)
    const userState = persistedData.user;
    const token = JSON.parse(userState as string).token;
  
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    
    if (token) {
      return { ...headers, 'Authorization': `Bearer ${token}`};
    } else {
      return headers;
    }
}