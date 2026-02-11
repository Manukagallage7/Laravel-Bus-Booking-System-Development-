import HeroSection from "@/components/home/HeroSection";

export const metadata = {
    title: "Bus Online Ticket Booking System | Sri Lanka",
    description: "Welcome to our bus booking system. Book your bus tickets easily and conveniently with us. We offer a wide range of bus routes and schedules to choose from. Experience hassle-free travel with our user-friendly platform.",
    keywords: ["bus booking system", "online bus ticket booking", "bus tickets", "bus routes", "bus schedules", "hassle-free travel"]
}

export default function Home() {
    return (
        <main className="bg-white">
            <HeroSection />
        </main>
    )
}