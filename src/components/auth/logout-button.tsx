"use client";

import { signOut } from "next-auth/react";

const LogoutButton = () => {
    return (
        <a
            onClick={async () => await signOut({callbackUrl: "/"})}
        >
            Logout
        </a>
    );
};

export default LogoutButton;
