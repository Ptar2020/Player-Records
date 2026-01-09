import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

// Utility function to extract cookies from the request
const extractCookies = async (): Promise<Record<string, string> | null> => {
  const allCookies = await cookies().getAll(); // Await cookies().getAll()
  if (!allCookies.length) return null;

  const extractedCookies: Record<string, string> = {};
  allCookies.forEach(({ name, value }) => {
    extractedCookies[name] = value;
  });

  return extractedCookies;
};

// Define the decoded token type
export interface DecodedToken extends JwtPayload {
  userId?: string;
  email?: string;
}

// Define the middleware function to extract user data from the token
export async function middleware(req: Request): Promise<DecodedToken | null> {
  try {
    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined in the environment variables");
    }

    const cookieData = await extractCookies(); // Await the async extractCookies function

    // If there's no cookies or no refresh token, return null
    const refreshToken = cookieData?.refreshToken;
    if (!refreshToken) {
      console.log("No refresh token found");
      return null;
    }

    // Verify the refresh token and extract the user data
    const decodedData = jwt.verify(refreshToken, SECRET_KEY) as DecodedToken;
    return decodedData;
  } catch (error: unknown) {
    // Handle error safely
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error in middleware:", errorMessage);
    return null; // Return null in case of any error
  }
}
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { cookies } from "next/headers";
// //This, initially, was named middleware.ts but was changed to avoid errors at deployment
// // Utility function to extract cookies from the request

// const extractCookies = (): Record<string, string> | null => {
//   const allCookies = cookies().getAll();
//   if (!allCookies.length) return null;

//   const extractedCookies: Record<string, string> = {};
//   allCookies.forEach(({ name, value }) => {
//     extractedCookies[name] = value;
//   });

//   return extractedCookies;
// };

// // Define the decoded token type
// export interface DecodedToken extends JwtPayload {
//   userId?: string; // Add specific properties based on your token structure
//   email?: string;
// }

// // Define the middleware function to extract user data from the token
// export async function middleware(req: Request): Promise<DecodedToken | null> {
//   try {
//     const SECRET_KEY = process.env.SECRET_KEY;
//     if (!SECRET_KEY) {
//       throw new Error("SECRET_KEY is not defined in the environment variables");
//     }

//     const cookieData = extractCookies();

//     // If there's no cookies or no refresh token, return null
//     const refreshToken = cookieData?.refreshToken;
//     if (!refreshToken) {
//       console.log("No refresh token found");
//       return null;
//     }

//     // Verify the refresh token and extract the user data
//     const decodedData = jwt.verify(refreshToken, SECRET_KEY) as DecodedToken;
//     // console.log("DecodedToken");
//     // console.log(decodedData);
//     // Return the decoded user data
//     return decodedData;
//   } catch (error: unknown) {
//     // Handle error safely
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error occurred";
//     console.error("Error in middleware:", errorMessage);
//     return null; // Return null in case of any error
//   }
// }
