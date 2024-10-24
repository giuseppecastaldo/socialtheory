import { auth } from "@/libs/auth";
import pusher from "@/libs/pusher";
import { NextRequest, NextResponse } from "next/server";
import { PresenceChannelData } from "pusher";

export async function POST(request: NextRequest) {
    const session = await auth();

    if (session) {
        const searchParams = new URLSearchParams(await request.text())

        const socketId = searchParams.get('socket_id') as string
        const channel = searchParams.get('channel_name') as string;

        const presenceData: PresenceChannelData = { user_id: session?.user?.email as string, user_info: session?.user };

        const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
        return NextResponse.json(authResponse);
    } else {
        return NextResponse.json({ message: "Authentication required" }, { status: 403 })
    }
}