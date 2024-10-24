'use client'

import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Avatar} from "@files-ui/react";
import {SubmitHandler, useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {updateUser} from "@/controllers/user";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const InfoForm = ({user}: {
    user: { id: string, name: string | null, email: string, image: string | null } | null
}) => {
    type Inputs = {
        avatar: string;
        name: string;
        email: string;
    };

    const [imageSource, setImageSource] = useState<File | string>(user?.image || "");
    const [success, setSuccess] = useState(false);

    const convertImageToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.onerror = () => {
                reject(new Error("Errore durante la conversione dell'immagine in Base64"));
            };
            reader.readAsDataURL(file);
        });
    };

    const onSubmit: SubmitHandler<Inputs> = async ({
                                                       name,
                                                       email
                                                   }) => {
        if (user) {
            const imageBase64 = await convertImageToBase64(imageSource as File);
            const updated = await updateUser(user.id, name, email, imageBase64);

            if (updated) {
                setSuccess(true);
                return;
            }
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
                <h3 className="text-xl font-bold">Info</h3>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {success && <Alert>
                        <AlertTitle>Done!</AlertTitle>
                        <AlertDescription>
                            Your profile has been updated successfully.
                        </AlertDescription>
                    </Alert>}
                    <Avatar
                        alt="Avatar"
                        emptyLabel={"Change avatar"}
                        changeLabel={"Change avatar"}
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
                        placeholder="Name"
                    />

                    <Input
                        type="email"
                        {...register("email")}
                        required
                        placeholder="Email"
                    />

                    <Button>Save</Button>
                </form>
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

            <Card className="mt-4">
                <CardHeader>
                    <h3 className="text-xl font-bold">Modifica la tua password</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        type="password"
                        placeholder="Password"
                    />

                    <Input
                        type="password"
                        placeholder="Conferma password"
                    />

                    <Button>Modifica</Button>
                </CardContent>
            </Card>

            <Card className="mt-4">
                <CardHeader>
                    <h3 className="text-xl font-bold">Danger Zone</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="destructive" className="bg-red-500 text-white p-2 rounded-md">Delete
                        Account</Button>
                </CardContent>
            </Card>
        </div>
    );
}

