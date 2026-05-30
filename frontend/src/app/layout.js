import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Dashboard from "./dashboard/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SecureAuth - Premium Auth & Protected Dashboard",
  description: "A highly secure and gorgeous glassmorphic web portal built with Next.js and Express.",
}; //TITLE AND DESCRIPTION FOR SEO, APPEARS IN BROWSER TAB AND SEARCH ENGINES

export default function RootLayout({ children }) 
//RootLayout is a special component in Next.js that wraps around all pages and components in the application. It allows us to define a common layout and structure for our app, such as including global styles, fonts, or any elements that should be present on every page (like a navbar or footer). In this case, we are using RootLayout to set up our global styles and include the floating background blobs that will be visible on all pages of our SecureAuth dashboard. The children prop represents the content of the specific page being rendered, which will be injected into this layout when each page is accessed.
{
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} //add font css classes to html
    suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {/* Floating background ambient visualizer blobs */}
        <div className="bg-ambient-glow">
          <div className="glow-blob-1"></div>
          <div className="glow-blob-2"></div>
        </div>
        
        {/* Core application body */}
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}

/* <html>
  <body>
    Background Effects
    App Container
      Login Page
  </body>
</html> */

// Browser Request
// ↓
// Next.js loads RootLayout
// ↓
// Global fonts/styles applied
// ↓
// Current page inserted into {children}(login, Dashboard, register, etc)
// ↓
// Final webpage rendered
