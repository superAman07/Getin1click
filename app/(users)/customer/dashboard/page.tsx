"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import HeroPage from "@/components/HeroPage";
import UpdateContactDetailsModal from '@/components/UpdateContactDetailsModal';

export default function CustomerDashboardPage() {
    const { data: session, update: updateSession, status } = useSession();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (status === 'authenticated' && !session.user.phoneNumber) {
            setShowModal(true);
        }
    }, [session, status]);

    const handleSuccess = async () => {
        await updateSession();
        setShowModal(false);
    };

    return (
        <>
            {showModal && (
                <UpdateContactDetailsModal 
                    onClose={() => {}} // We force the user to complete it
                    onSuccess={handleSuccess} 
                />
            )}
            <HeroPage />
        </>
    );
}