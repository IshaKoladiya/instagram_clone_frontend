import { useEffect, useState } from "react";
import createPost from "../../../assets/image/create_post.png";
import crossIcon from "../../../assets/svg/close-square-white.svg";
import userPostStyle from "../style/user-post.module.css";
import Cropper, { Area } from "react-easy-crop";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Filters {
  brightness: number;
  contrast: number;
  saturate: number;
  temperature: number;
  fade: number;
  vignette: number;
}

interface AdditionalSetting {
  count: boolean;
  comment: boolean;
}

interface UserPostProps {
  handleModal: (flag: boolean) => void;
}

const UserPost: React.FC<UserPostProps> = (props) => {
  // props
  const { handleModal } = props;

  const [yourImage, setYourImage] = useState<string | undefined>(undefined);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedImage, setCroppedImage] = useState<string | undefined>(
    undefined
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null
  );
  const [filters, setFilters] = useState<Filters>({
    brightness: 1,
    contrast: 100,
    saturate: 100,
    temperature: 0,
    fade: 0,
    vignette: 0,
  });
  const [steps, setSteps] = useState(1);
  const [userData, setUserData] = useState({
    profile: "",
    username: "",
  });
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [postCaption, setPostCaption] = useState("");
  const [location, setLocation] = useState("");
  const [altText, setAltText] = useState("");
  const [additionalSetting, setAdditionalSetting] = useState<AdditionalSetting>({
    count: false,
    comment: false,
  });

  const tokenFromLocalStorage = localStorage.getItem("token");
  const token: string | null | Blob = tokenFromLocalStorage
    ? JSON.parse(tokenFromLocalStorage)
    : null;

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setYourImage(reader.result);
        }
        setSteps(2);
      };
    }
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const convertImageUsingCanvas = () => {
    if (!yourImage || !croppedAreaPixels) return;

    const image = new Image();
    image.src = yourImage;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.filter = `brightness(${filters.brightness}) contrast(${filters.contrast}%) saturate(${filters.saturate}%) sepia(${filters.temperature}%) grayscale(${filters.fade}%) drop-shadow(0 0 ${filters.vignette}px rgba(0, 0, 0, 0.5))`;

      ctx.drawImage(
        image,
        croppedAreaPixels.x * scaleX,
        croppedAreaPixels.y * scaleY,
        croppedAreaPixels.width * scaleX,
        croppedAreaPixels.height * scaleY,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      const croppedImageBase64 = canvas.toDataURL("image/jpeg");
      setCroppedImage(croppedImageBase64);
    };
  };

  const handleNext = () => {
    if (steps == 2 || steps == 3) {
      convertImageUsingCanvas();
    } else if (steps == 4) {
      handlePost();
      return;
    }

    setSteps(steps + 1);
  };

  const handlePost = () => {
    const url = "http://localhost:4000/user/post";

    const formData  = new FormData();

    formData.append("image", dataURLtoFile(croppedImage, "postImage.jpg"));
    formData.append("caption", postCaption);
    formData.append("location", location);
    formData.append("altText", altText);
    formData.append("likeViewCount", additionalSetting.count.toString());
    formData.append("commentOff", additionalSetting.comment.toString());
    formData.append("token", token as string);

    axios
      .post(url, formData)
      .then((response) => {
        alert(response.data);
        handleModal(false)
      })
      .catch((error) => {
        alert(error.response.data);
      });
  };

  function dataURLtoFile(dataurl : any, filename: any) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  const fetchUserData = () => {
    const url = "http://localhost:4000/user/token";

    const body = {
      token: token,
    };

    axios
      .post(url, body)
      .then((res) => {
        setUserData(res.data.user);
      })
      .catch((err) => {
        alert(err.response.data);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  

  return (
    <>
      <div className={userPostStyle.modal}>
        <img
          src={crossIcon}
          alt="cross"
          className="absolute top-0 right-0 w-14 cursor-pointer"
          onClick={() => handleModal(false)}
        />
        <div>
          <div className="border-b-2 flex justify-between py-2 border-black text-center font-bold text-xl">
            <div onClick={() => setSteps(steps - 1)}>
              {steps != 1 && <i className="cursor-pointer fa-solid fa-arrow-left"></i>}
            </div>
            <div>Create new post</div>
            <div onClick={handleNext}>
              {steps != 1 && <i className="cursor-pointer fa-solid fa-arrow-right"></i>}
            </div>
          </div>
          {steps == 1 ? (
            <>
              <div className="flex justify-center pt-10">
                <img src={createPost} alt="" />
              </div>
              <p className="text-xl text-center pb-10">
                Drag photos and videos here
              </p>
              <div className="pb-14 flex justify-center">
                <label htmlFor="profile">
                  <span className="my-3 px-8 py-3 border rounded  bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">
                    Select from computer
                  </span>
                </label>
                <input
                  type="file"
                  hidden
                  id="profile"
                  onChange={onSelectFile}
                />
              </div>
            </>
          ) : steps == 2 ? (
            <>
              <div className={userPostStyle.cropperContainer}>
                <Cropper
                  image={yourImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  zoomWithScroll={false}
                />
                <input
                  type="range"
                  value={zoom}
                  onChange={(e: any) => setZoom(e.target.value)}
                  min={1}
                  max={3}
                  step={0.01}
                  className={userPostStyle.zoomBar}
                />
              </div>
            </>
          ) : steps == 3 ? (
            <>
              <div>
                <img
                  src={croppedImage}
                  width={"100%"}
                  style={{
                    filter: `brightness(${filters.brightness}) contrast(${filters.contrast}%) saturate(${filters.saturate}%) 
                sepia(${filters.temperature}%) grayscale(${filters.fade}%) 
                drop-shadow(0 0 ${filters.vignette}px rgba(0, 0, 0, 0.5))`,
                  }}
                  alt="cropped"
                />
              </div>
              <div className={userPostStyle.filters}>
                <div>
                  <label>Brightness</label>
                  <input
                    type="range"
                    min={0.5}
                    max={1.5}
                    step={0.01}
                    value={filters.brightness}
                    onChange={(e: any) =>
                      setFilters({ ...filters, brightness: e.target.value })
                    }
                  />
                  <label>Contrast</label>
                  <input
                    type="range"
                    min={50}
                    max={150}
                    step={1}
                    value={filters.contrast}
                    onChange={(e: any) =>
                      setFilters({ ...filters, contrast: e.target.value })
                    }
                  />
                  <label>Fade</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={filters.fade}
                    onChange={(e: any) =>
                      setFilters({ ...filters, fade: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Saturation</label>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    step={1}
                    value={filters.saturate}
                    onChange={(e: any) =>
                      setFilters({ ...filters, saturate: e.target.value })
                    }
                  />
                  <label>Temperature</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={filters.temperature}
                    onChange={(e: any) =>
                      setFilters({ ...filters, temperature: e.target.value })
                    }
                  />
                  <label>Vignette</label>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={filters.vignette}
                    onChange={(e: any) =>
                      setFilters({ ...filters, vignette: e.target.value })
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <>
            <div className={userPostStyle.caption}>
              <div className={userPostStyle.profileDiv}>
                <div>
                  <img
                      className="rounded-full w-12 h-12 mr-3"
                      src={`/src/assets/image/${
                        userData.profile
                          ? userData.profile
                          : "insta_Blank_image.jpg"
                    }`}
                    alt=""
                  />
                </div>
                  <div className="font-bold">{userData.username}</div>
              </div>
                <div className="border-b-2 p-2">
              <textarea
                    className="text-black border-b-0 resize-none"
                    cols={0}
                rows={3}
                placeholder="Write a caption..."
                value={postCaption}
                onChange={(e) => setPostCaption(e.target.value)}
              ></textarea>
              <i
                className="fa-regular fa-face-smile"
                onClick={() => setEmojiOpen(true)}
              ></i>
                  <EmojiPicker
                open={emojiOpen}
                onEmojiClick={(value) => {
                  setPostCaption(postCaption + value.emoji);
                  setEmojiOpen(false);
                }}
                  />
                </div>
              <div className={userPostStyle.inputs}>
                <i
                  className="fa-solid fa-location-dot"
                  style={{ marginRight: "10px" }}
                ></i>
                <input
                  type="search"
                  placeholder="Add Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                    className="p-3 outline-none w-11/12"
                />
              </div>
                <div className={userPostStyle.inputs}>
                <i
                  className="fa-brands fa-pied-piper-alt"
                  style={{ marginRight: "10px" }}
                ></i>
                <input
                  type="text"
                  placeholder="Alt text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                    className="p-3 outline-none w-11/12"
                />
              </div>
              <div className={userPostStyle.checkBoxs}>
                  <div className="my-3">
                    <label
                      htmlFor="likeViewCount"
                      className="font-bold flex items-center"
                    >
                  <input
                        className="mr-3 w-5 h-5"
                    type="checkbox"
                    id="likeViewCount"
                    checked={additionalSetting.count}
                    onChange={(e) =>
                      setAdditionalSetting({
                        ...additionalSetting,
                        count: e.target.checked,
                      })
                    }
                  />
                    Hide like and view count
                  </label>
                </div>
                  <div className="my-3">
                    <label
                      htmlFor="comment"
                      className="font-bold flex items-center"
                    >
                  <input
                        className="mr-3 w-5 h-5"
                    type="checkbox"
                    id="comment"
                    checked={additionalSetting.comment}
                    onChange={(e) =>
                      setAdditionalSetting({
                        ...additionalSetting,
                        comment: e.target.checked,
                      })
                    }
                  />
                      Turn off comment
                    </label>
                </div>
              </div>
            </div>
          </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserPost;
