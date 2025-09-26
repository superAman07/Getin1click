import AuthPage from "@/components/Login";
import Login from "@/components/Login";
import { notFound } from "next/navigation";

export default function ({params}: {params: {slug: string}}) {
    if (params.slug !== 'login' && params.slug !== 'signup') {
        notFound();
    }

    return <AuthPage initialMode={params.slug as 'login' | 'signup'} />;
}