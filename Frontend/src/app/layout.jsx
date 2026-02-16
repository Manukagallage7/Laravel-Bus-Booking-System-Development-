import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { AuthProvider } from "./context/AuthContext";

import "./globals.css"

export default function Layout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    )
}