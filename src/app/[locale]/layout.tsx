import type {Metadata, Viewport} from "next";
import {Inter} from "next/font/google";
import "@/styles/globals.css";
import {createHash} from "crypto";
import {getMessages} from "next-intl/server";
import {NextIntlClientProvider} from "next-intl";
import SessionProvider from "@/components/providers/session-provider";
import {PusherProvider} from "@/components/hooks/use-pusher";
import LocaleSwitcher from "@/components/i18n/locale-switcher";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import LogoutButton from "@/components/auth/logout-button";
import {auth} from "@/libs/auth";
import {Link} from "@/navigation";
import {getUserById} from "@/controllers/user";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "SocialTheory",
    description: "SocialTheory is a social network for the modern age.",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const messages = await getMessages();
    const session = await auth();
    const user = session && await getUserById(session?.user?.id as string);

    const emailHash = createHash("md5")
        .update(user?.email?.trim().toLowerCase() || "")
        .digest("hex");
    let imageUrl = user?.image || `https://www.gravatar.com/avatar/${emailHash}?d=mp`;

    return (
        <html lang="en">
        <NextIntlClientProvider messages={messages}>
            <SessionProvider>
                <PusherProvider>
                    <body className={inter.className}>
                    {session && <header className="bg-white border-b border-gray-200">
                        <div className="mx-auto flex items-center justify-between py-4 px-6">
                            <div className="flex-shrink-0">
                                <Link href={'/'}>
                                    <img
                                        src="/images/logo.png"
                                        alt="Logo"
                                        className="h-10 w-auto"
                                    />
                                </Link>
                            </div>

                            <div className="flex items-center space-x-4">
                                <LocaleSwitcher/>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <img
                                            src={imageUrl}
                                            alt="User Avatar"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Link href={'/profile'}>
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <LogoutButton/>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>}
                    {children}
                    </body>
                </PusherProvider>
            </SessionProvider>
        </NextIntlClientProvider>
        </html>
    );
}