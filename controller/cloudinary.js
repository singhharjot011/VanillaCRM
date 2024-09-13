import cloudinary from "cloudinary";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Resolve file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../config.env") });

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true, // Add this line
});

export const getSignedImageUrl = (publicId) => {
  const timestamp = Math.round(new Date().getTime() / 1000); // Get current timestamp in seconds
  const signature = cloudinary.utils.api_sign_request(
    {
      public_id: publicId,
      timestamp: timestamp,
      type: "authenticated",
    },
    process.env.CLOUD_API_SECRET
  );

  // Generate the signed URL with the signature, timestamp, and secure option
  return cloudinary.url(publicId, {
    sign_url: true,
    secure: true,
    type: "authenticated",
    version: timestamp,
    signature: signature,
    api_key: process.env.CLOUD_API_KEY,
  });
};

export default cloudinary;
