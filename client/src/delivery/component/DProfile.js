import React, { useEffect, useState } from "react";
import { editProfile } from "../middleware/API";
import { Container, Spinner } from "react-bootstrap";
import { modifyUserInfo, selectUserInfo } from "../../redux/slices/userInfo";
import { useDispatch, useSelector } from "react-redux";
import { BsFillCameraFill } from "react-icons/bs";

function DProfile() {
  const [userData, setUserData] = useState("");
  const [imgLoading, setImgLoading] = useState(false);

  console.log(userData);

  // console.log(editData);

  const dispatch = useDispatch();
  const data = useSelector(selectUserInfo);

  const handleAvatarClick = (e) => {
    if (!imgLoading) {
      document.getElementById("fileInput").click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (!file) {
      return;
    }

    reader.onload = async () => {
      const base64 = reader.result;
      const img = new Image();

      img.onload = async () => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        let quality = 1;
        let resizedBase64 = canvas.toDataURL(file.type, quality);

        // Check if the base64 string size exceeds 1 MB
        while (resizedBase64.length > 1000000 && quality > 0.1) {
          quality -= 0.1;
          resizedBase64 = canvas.toDataURL(file.type, quality);
        }
        setImgLoading(true);
        try {
          const newUserData = await editProfile({ avator: resizedBase64 });
          console.log(newUserData);
          dispatch(modifyUserInfo(newUserData));
        } catch (error) {
          console.log(error);
        }
        setImgLoading(false);
      };

      img.src = base64;
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    setUserData(data);
  }, [data]);

  return (
    <div className=" profile-container">
      <Container className="py-1 profile-card">
        <div>
          {imgLoading ? (
            <div
              className="mt-4"
              style={{
                width: "180px",
                height: "180px",
                position: "relative",
              }}
            >
              <img
                className="mt-4 profile-avatar"
                style={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  position: "relative",
                }}
              ></img>

              <Spinner
                animation="border"
                size="md"
                style={{
                  color: "black",
                  position: "absolute",
                  right: 75,
                  top: 100,
                }}
              />
            </div>
          ) : (
            <div className="profile-div">
              <img
                className="mt-4 profile-avatar"
                style={{ width: "180px", height: "180px", borderRadius: "50%" }}
                src={userData.avatar}
                alt="Avatar"
              />
              <BsFillCameraFill
                style={{ fontSize: "40px", cursor: "pointer" }}
                className="addImg"
                onClick={handleAvatarClick}
              />
            </div>
          )}
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <div className="row mt-5 ">
          <div className="col-4 col-md-3 ">
            <h2 className="mb-1 pa"> NAME </h2>
          </div>
          <div className="col-1 ">
            <h2 className="mb-1 pa"> : </h2>
          </div>
          <div className="col-sm ">
            <h4> {userData.name}</h4>
          </div>
        </div>
        <div className="row mt-4 " style={{ wordWrap: "break-word" }}>
          <div className="col-4 col-md-3 ">
            <h2 className="mb-1 pa"> EMAIL </h2>
          </div>
          <div className="col-1 ">
            <h2 className="mb-1 pa"> : </h2>
          </div>
          <div className="col-sm ">
            <h4> {userData.email}</h4>
          </div>
        </div>
        <div className="row my-4 ">
          <div className="col-4 col-md-3 ">
            <h2 className="mb-1 pa"> NUMBER </h2>
          </div>
          <div className="col-1 ">
            <h2 className="mb-1 pa"> : </h2>
          </div>
          <div className="col-sm ">
            <h4>
              {userData.phoneNo
                ? userData.phoneNo
                : "No Phone Number provided, please edit"}
            </h4>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default DProfile;
