import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {DEFAULT_LOGIN_REDIRECT,apiAuthPrefix,authRoutes,publicRoutes} from "@/routes"
const {auth} = NextAuth(authConfig);

 
export default auth((req) => {

  //Dont Touch My Sudda
  const {nextUrl} = req;
  const isLogedIn = !!req.auth;
  const isAPiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  console.log("isLogedIn",isLogedIn);

  if(isAPiAuthRoute){
    return null;
  }

  if(isAuthRoute )
  {
    if(isLogedIn)
      {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT,nextUrl));
      }
      return null;
  }

  if(!isLogedIn && !isPublicRoute)
  {
    return Response.redirect(new URL('/auth/login',nextUrl));
  }
  
})
 

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'],
}