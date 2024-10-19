import axios from "axios"; 

export const verifyRecaptcha = async (recaptchaToken: string): Promise<boolean> => {
  const secretKey = process.env.RSK;
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
  
  try {
    const response = await axios.post(verifyUrl);
    return response.data.success;
  } catch (error) {
    console.error("reCAPTCHA verification failed:", error);
    return false;
  }
};
