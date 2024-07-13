import { jwtDecode } from "jwt-decode";

const islogin = () => {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  console.log("All cookies:", cookies);

  const jwtaccessCookie = cookies.find((cookie) =>
    cookie.startsWith("uiToken=")
  );
  console.log("Found cookie:", jwtaccessCookie);

  if (jwtaccessCookie) {
    try {
      const jwtaccessValue = jwtaccessCookie.split("=")[1];
      const decodedJWT = jwtDecode(jwtaccessValue);
      console.log("Decoded JWT:", decodedJWT);
      return decodedJWT;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }

  console.log("No uiToken cookie found");
  return null;
};

export default islogin;
