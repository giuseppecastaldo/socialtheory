'use client'

import {useForm, SubmitHandler} from "react-hook-form";
import LocaleSwitcher from "@/components/i18n/locale-switcher";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Link, useRouter} from "@/navigation";
import {createUser} from "@/controllers/user";
import {useState} from "react";

type Inputs = {
    name: string;
    email: string;
    password: string;
    password2: string;
};

export default function Register() {
    const {
        register,
        handleSubmit,
        reset
    } = useForm<Inputs>();
    const [error, setError] = useState('');
    const router = useRouter();

    const t = useTranslations('Login');

    const onSubmit: SubmitHandler<Inputs> = async ({
                                                       name,
                                                       email,
                                                       password,
                                                       password2,
                                                   }) => {
        const user = await createUser(name, email, password, password2);

        if (user.error) {
            setError(user.error);
            return;
        }

        reset();
        router.push('/login');
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
                {error && (
                    <div className="text-red-500">{error}</div>
                )}

                <div className="flex justify-center items-center p-6">
                    <img
                        src="/images/logo.png"
                        className={"h-10"}
                        alt={"Logo"}
                    />
                </div>
                <h1 className="font-bold text-2xl text-center">{t('signUp')}</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                    <Input
                        {...register("name")}
                        placeholder={t('name')}
                        type="text"
                        id="name"
                        required
                        className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:border-blue-500"
                    />

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

                    <Input
                        {...register("password2")}
                        placeholder={t('confirmPassword')}
                        type="password"
                        id="password2"
                        required
                        className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:border-blue-500"
                    />

                    <Button type="submit" variant="outline" className="w-full mt-8"> {t('signUp')}</Button>
                </form>

                <div className="text-center">
                    <Link href="/login">
                        {t('login')}
                    </Link>
                </div>

                <LocaleSwitcher/>
            </div>
        </div>
    );
}