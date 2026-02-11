import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

import "./globals.css"

export default function Layout({ children }) {
    return (
        <html lang="en">
            <body>
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    )
}