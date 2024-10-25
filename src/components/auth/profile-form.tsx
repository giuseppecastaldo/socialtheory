'use client'

import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Avatar} from "@files-ui/react";
import {SubmitHandler, useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {deleteUser, updatePassword, updateUser} from "@/controllers/user";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {signOut} from "next-auth/react";
import {useTranslations} from 'next-intl';

const InfoForm = ({user}: {
    user: { id: string, name: string | null, email: string, image: string | null } | null
}) => {
    const t = useTranslations('Profile');

    type Inputs = {
        avatar: string;
        name: string;
        email: string;
    };

    const [imageSource, setImageSource] = useState<File | string>(user?.image || "");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const convertImageToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.onerror = () => {
                reject(new Error(t('imageError')));
            };
            reader.readAsDataURL(file);
        });
    };

    const onSubmit: SubmitHandler<Inputs> = async ({
                                                       name,
                                                       email
                                                   }) => {
        if (user) {
            let imageBase64 = null;
            if (imageSource instanceof File) {
                imageBase64 = await convertImageToBase64(imageSource as File);
            }

            const updated = await updateUser(user.id, name, email, imageBase64);

            if (updated.error) {
                setError(updated.error);
                return;
            }

            setSuccess(true);
            setError(null);
        }

    };

    const {
        register,
        handleSubmit,
        setValue
    } = useForm<Inputs>();

    useEffect(() => {
        if (user) {
            setValue("name", user.name as string);
            setValue("email", user.email);
            setValue("avatar", user.image as string);
        }
    }, [])

    return (
        <Card>
            <CardHeader>
                <h3 className="text-xl font-bold">{t('info')}</h3>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {success && <Alert>
                        <AlertTitle>{t('done')}</AlertTitle>
                        <AlertDescription>
                            {t('profileUpdated')}
                        </AlertDescription>
                    </Alert>}

                    {error && <Alert variant="destructive">
                        <AlertTitle>{t('error')}</AlertTitle>
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>}

                    <Avatar
                        alt="Avatar"
                        emptyLabel={t('changeAvatar')}
                        changeLabel={t('changeAvatar')}
                        required
                        src={imageSource}
                        onChange={(file) => setImageSource(file)}
                        accept={"image/*"}
                        variant="circle"
                    />

                    <Input
                        type="text"
                        {...register("name")}
                        required
                        placeholder={t('name')}
                    />

                    <Input
                        type="email"
                        {...register("email")}
                        required
                        placeholder={t('email')}
                    />

                    <Button>{t('save')}</Button>
                </form>
            </CardContent>
        </Card>
    )
}

const PasswordChangeForm = ({user}: {
    user: { id: string, name: string | null, email: string, image: string | null } | null
}) => {
    const t = useTranslations('Profile');
    type Inputs = {
        oldPassword: string;
        password: string;
        password2: string;
    };

    const {
        register,
        handleSubmit
    } = useForm<Inputs>();

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const onSubmit: SubmitHandler<Inputs> = async ({
                                                       oldPassword,
                                                       password,
                                                       password2
                                                   }) => {
        const result = await updatePassword(user?.id as string, oldPassword, password, password2);

        if (result.error) {
            setError(result.error);
            return;
        }

        setSuccess(true);
        setError(null);
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <h3 className="text-xl font-bold">{t('changePassword')}</h3>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {success && <Alert>
                        <AlertTitle>{t('done')}</AlertTitle>
                        <AlertDescription>
                            {t('passwordUpdated')}
                        </AlertDescription>
                    </Alert>}

                    {error && <Alert variant="destructive">
                        <AlertTitle>{t('error')}</AlertTitle>
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>}

                    <Input
                        type="password"
                        {...register("oldPassword")}
                        placeholder={t('oldPassword')}
                    />

                    <Input
                        type="password"
                        {...register("password")}
                        placeholder={t('newPassword')}
                    />

                    <Input
                        type="password"
                        {...register("password2")}
                        placeholder={t('confirmPassword')}
                    />

                    <Button type="submit">{t('change')}</Button>
                </form>
            </CardContent>
        </Card>
    )
}

const DeleteAccount = ({user}: {
    user: { id: string, name: string | null, email: string, image: string | null } | null
}) => {
    const t = useTranslations('Profile');
    const deleteAccount = async () => {
        await deleteUser(user?.id as string);
        await signOut({callbackUrl: "/"})
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <h3 className="text-xl font-bold">{t('dangerZone')}</h3>
            </CardHeader>
            <CardContent>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive">
                            {t('deleteAccount')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('areYouSure')}</DialogTitle>
                            <DialogDescription>
                                {t('actionIrreversible')}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={deleteAccount} variant="destructive">{t('confirm')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}

export default function ProfileForm({user}: {
    user: { id: string, name: string | null, email: string, image: string | null } | null
}) {
    return (
        <div className="mt-4 w-full">
            <InfoForm user={user}/>

            <PasswordChangeForm user={user}/>

            <DeleteAccount user={user}/>
        </div>
    );
}