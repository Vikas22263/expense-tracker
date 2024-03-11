// const axios = require('./axios.min.js');

// const Baseurl = "http://localhost:9000";

// export const Axioscall = async (method = "GET", url, headers="Content-Type': 'application/json", body = null) => {
//   try {
//     const send = {
//       method: method,
//       url: Baseurl + url,
//       headers: headers,
//     };
//     if (body !== null) {
//       send.body = body;
//     }
//     const response = await axios(send );

//     return response;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };
