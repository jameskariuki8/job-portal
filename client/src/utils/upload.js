import axios from "axios";
const upload=async(file)=>{
    if (!file) return "";
    const data=new FormData();
    data.append('file',file);
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    if (!uploadPreset) {
        throw new Error("Missing REACT_APP_CLOUDINARY_UPLOAD_PRESET env var");
    }
    data.append('upload_preset', uploadPreset);

    try {
        const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
        if (!cloudName) {
            throw new Error("Missing REACT_APP_CLOUDINARY_CLOUD_NAME env var");
        }
        // Use auto resource type so images, PDFs, docs, and other files are accepted
        const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
        const res=await axios.post(endpoint,data);
        const { secure_url } = res.data;
        return secure_url;
    } catch (err) {
        // Surface Cloudinary error details to the console for easier debugging
        if (err && err.response) {
            console.error("Cloudinary upload error:", err.response.data || err.response.statusText);
        } else {
            console.error("Cloudinary upload error:", err.message || err);
        }
        throw err;
    }
}
export default upload;
