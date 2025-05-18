import { Poppins } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import ReduxProvider from "@/redux/Provider";
import AppInitializer from "@/components/initializer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Optional: adjust based on your usage
});

export const metadata = {
  title: "Miniweather Station Dashboard",
  description: "A mini weather station dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`} >
        <ReduxProvider>
          <AppInitializer />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
