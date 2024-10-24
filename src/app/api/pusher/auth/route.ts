import { auth } from "@/libs/auth";
import pusher from "@/libs/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const session = await auth();

    if (session) {
        const searchParams = new URLSearchParams(await request.text())
        const socketId = searchParams.get('socket_id') as string

        const user = {
            id: session?.user?.email as string,
            user_info: session?.user
        };

        const authResponse = pusher.authenticateUser(socketId, user);

        return NextResponse.json(authResponse);
    } else {
        return NextResponse.json({ message: "Authentication required" }, { status: 403 })
    }

}