'use client'

import {useForm, SubmitHandler} from "react-hook-form";
import {signIn} from "next-auth/react";
import {useSearchParams} from "next/navigation";
import LocaleSwitcher from "@/components/i18n/locale-switcher";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Link} from "@/navigation";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

type Inputs = {
    email: string;
    password: string;
};

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Inputs>();

    const t = useTranslations('Login');

    const searchParams = useSearchParams();

    const onSubmit: SubmitHandler<Inputs> = async ({
                                                       email,
                                                       password
                                                   }) => {
        signIn("credentials", {
            redirect: true,
            email,
            password,
            callbackUrl: "/",
        });
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
                {searchParams.get("error") === "CredentialsSignin" &&
                    <Alert variant="destructive">
                        <AlertTitle>{t('error')}</AlertTitle>
                        <AlertDescription>
                            {t('incorrectCredentials')}
                        </AlertDescription>
                    </Alert>}


                {searchParams.get("error") === "AccessDenied" &&
                    <Alert variant="destructive">
                        <AlertTitle>{t('error')}</AlertTitle>
                        <AlertDescription>
                            {t('accessDenied')}
                        </AlertDescription>
                    </Alert>}

                <div className="flex justify-center items-center p-6">
                    <img
                        src="/images/logo.png"
                        className={"h-10"}
                        alt={"Logo"}
                    />
                </div>
                <h1 className="font-bold text-2xl text-center">{t('login')}</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                    <Input
                        {...register("email")}
                        placeholder={t('email')}
                        type="email"
                        id="email"
                        required
                        className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:border-blue-500"
                    />

                    <Input
                        {...register("password")}
                        placeholder={t('password')}
                        type="password"
                        id="password"
                        required
                        className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:border-blue-500"
                    />

                    <Button type="submit" variant="outline" className="w-full mt-8"> {t('signIn')}</Button>
                </form>

                <Button
                    onClick={() => signIn("google")}
                    variant="secondary"
                    className="w-full mt-4"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100"
                         viewBox="0 0 48 48">
                        <path fill="#FFC107"
                              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        <path fill="#FF3D00"
                              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                        <path fill="#4CAF50"
                              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                        <path fill="#1976D2"
                              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    {t('signInWithGoogle')}
                </Button>
                <div className="text-center">
                    <Link href="/register">
                        {t('signUp')}
                    </Link>
                </div>
                <br/>
                <LocaleSwitcher/>
            </div>
        </div>
    );
}