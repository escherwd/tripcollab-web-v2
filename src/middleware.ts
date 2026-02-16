import { authkit, handleAuthkitHeaders } from "@workos-inc/authkit-nextjs";
import { minimatch } from "minimatch";
import { NextRequest } from "next/server";

// In middleware auth mode, each page is protected by default.
// Exceptions are configured via the `unauthenticatedPaths` option.
// export default authkitMiddleware({
//   signUpPaths: [],
//   middlewareAuth: {
//     enabled: false,
//     unauthenticatedPaths: [
//       '/t/:slug*',
//       '/welcome'
//     ],
//   },
// });
export default async function proxy(request: NextRequest) {
  // For Next.js ≤15, use: export default async function middleware(request: NextRequest) {
  // Get session, headers, and the WorkOS authorization URL for sign-in redirects
  const { session, headers, authorizationUrl } = await authkit(request);

  const { pathname } = request.nextUrl;

  const authenticatedRoutes = ["/", "/settings", "/settings/**/*"];

  if (
    !session.user &&
    authenticatedRoutes.map((r) => minimatch(pathname, r)).includes(true)
  ) {
    // User does not have access to this route
    return handleAuthkitHeaders(request, headers, {
      redirect: "/welcome",
    });
  }

  // User has access to this route, carry on
  return handleAuthkitHeaders(request, headers);
}

// Match against pages that require authentication
// Leave this out if you want authentication on every page in your application
// export const config = { matcher: ['/account/:page*'] };
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|tripcollab-logo.svg|images).*)",
  ],
};
