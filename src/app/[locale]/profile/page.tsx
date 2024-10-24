'use server'

import ProfileForm from "@/components/auth/profile-form";
import { Separator } from "@/components/ui/separator"
import {auth} from "@/libs/auth";
import {getUserByEmail} from "@/controllers/user";

export default async function Profile() {
    const session = await auth();
    const user = await getUserByEmail(session?.user?.email);

    // TODO verify if email changed and update user
    // TODO if photo not changed, do not upload
    // TODO upload loading

    return (
        <div className="container mx-auto p-8">

            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-lg mb-4">This is how others will see you on the site.</p>

            <Separator orientation="horizontal" />

            <ProfileForm user={user}/>


        </div>
    );
}