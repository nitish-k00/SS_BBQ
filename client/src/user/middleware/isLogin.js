import { jwtDecode } from "jwt-decode";

const islogin = () => {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

  console.log(document.cookie)
  const jwtaccessCookie = cookies.find((cookie) =>
    cookie.startsWith("uiToken=")
  );
  console.log(jwtaccessCookie,"ff")
  if (jwtaccessCookie) {
    const jwtaccessValue = jwtaccessCookie.split("=")[1];
    const decodedJWT = jwtDecode(jwtaccessValue);
    return decodedJWT;
  }
  return null;
};

export default islogin;
