"use strict"; //ensures no accidental errors
"use client"; //used in nextjs app router, tells nextjs that this component should be rendered on the client/browser side, not server side. This is important for components that use hooks or browser APIs that are not available during server-side rendering.

//server component can't use hooks or browser APIs, so we need to specify that this is a client component. In this case, we want to check for authentication status on the client side and redirect accordingly, which is why we use "use client" here. server cannot use useEffect or localStorage, so we need to ensure this component is rendered on the client side where those features are available.

import { useEffect } from "react";//useEffect is a React hook that allows us to perform side effects in functional components. In this case, we will use it to check for authentication status when the component mounts and redirect the user accordingly.

import { useRouter } from "next/navigation";//for page redirection in nextjs app router. useRouter is a hook that gives us access to the router object, which we can use to programmatically navigate to different pages. In this case, we will use it to redirect the user to the dashboard if they are authenticated, or to the login page if they are not.

export default function Home() //creates a react component named home (function componentname() {})
//export default means that this is the main thing being exported from this file.
{
  const router = useRouter(); //create router object using the useRouter hook, which we can use to navigate to different pages.

  useEffect(() => {
    // Client-side authentication check after page loads in the browser
    const token = localStorage.getItem("token");
    //loacl starage is browser memory. getitem retrieves it and setitem stores it. token is the key we use to store the authentication token when the user logs in. If the token exists, it means the user is authenticated, and we can redirect them to the dashboard. If it doesn't exist, we redirect them to the login page. This check ensures that users who are already logged in don't have to go through the login process again and can access their dashboard directly.
    if (token) //if it exists tthen user authenticated
    {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router] //dependency array for useEffect, we include router here to ensure that the effect runs whenever the router object changes. In this case, it will run once when the component mounts, which is what we want for our authentication check.
);

//   Check if user logged in.
// If yes → dashboard
// If no → login page

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
      <div className="spinner spinner-large"></div>
      <p style={{ color: "var(--text-secondary)", fontWeight: 500, fontSize: "1.1rem" }}>
        Loading SecureAuth Portal...
      </p>
    </div>
  );
}
