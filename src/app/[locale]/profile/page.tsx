'use server'

import ProfileForm from "@/components/auth/profile-form";
import { Separator } from "@/components/ui/separator"
import {auth} from "@/libs/auth";
import {getUserById} from "@/controllers/user";
import {getTranslations} from 'next-intl/server';

export default async function Profile() {
    const session = await auth();
    const t = await getTranslations('Profile');

    const user = await getUserById(session?.user?.id as string);

    return (
        <div className="container mx-auto p-8">

            <h1 className="text-3xl font-bold">{t('profile')}</h1>
            <p className="text-lg mb-4">{t('description')}</p>

            <Separator orientation="horizontal" />

            <ProfileForm user={user}/>
        </div>
    );
}