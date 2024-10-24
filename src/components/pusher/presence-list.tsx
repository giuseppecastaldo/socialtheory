"use client";

import React, {useState, useEffect} from "react";
import {usePusher} from "../hooks/use-pusher";
import {PresenceChannel} from "pusher-js";
import {createHash} from "crypto";
import {useSession} from "next-auth/react";

interface Member {
    id: string;
    info: {
        name: string;
        email: string;
        image: string | null;
    };
}

const PresenceList: React.FC = () => {
    const pusher = usePusher();
    const [users, setUsers] = useState<Member[]>([]);
    const {data: session} = useSession();

    useEffect(() => {
        const channel: PresenceChannel = pusher?.subscribe(
            "presence-quickstart"
        ) as PresenceChannel;

        channel?.bind("pusher:subscription_succeeded", (members: Member[]) => {
            setUsers([]);
            channel.members.each((member: Member) => {
                const index = users.findIndex((user) => user.id === member.id);
                if (index === -1) {
                    setUsers((prevUsers) => [...prevUsers, member]);
                }
            });
        });

        channel?.bind("pusher:member_added", (member: Member) => {
            const index = users.findIndex((user) => user.id === member.id);
            if (index === -1) {
                setUsers((prevUsers) => [...prevUsers, member]);
            }
        });

        channel?.bind("pusher:member_removed", (memberToRemove: Member) => {
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== memberToRemove.id)
            );
        });

        return () => {
            pusher?.unbind("notification");
            channel?.unbind_all();
            channel?.unsubscribe();
        };
    }, [pusher]);

    return (
        users.length > 0 && (
            <div className="bg-white divide-y divide-gray-200">
                {users
                    .filter((u) => session?.user?.email !== u.info.email)
                    .map((user: any) => {
                        const emailHash = createHash("md5")
                            .update(user.info.email.trim().toLowerCase() || "")
                            .digest("hex");
                        let imageUrl = `https://www.gravatar.com/avatar/${emailHash}?d=mp`;

                        if (user.info.image) {
                            imageUrl = user.info.image;
                        }

                        return (

                            <div key={user.info.email} className="flex items-center p-4">
                                <div className="flex-shrink-0">
                                    <img
                                        width={60}
                                        height={60}
                                        alt="User Avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                        src={imageUrl}
                                    />
                                </div>

                                <div className="ml-4">
                                    <h2 className="font-medium text-lg">{user.info.name}</h2>
                                    <p className="text-gray-400">{user.info.email}</p>
                                </div>

                                <div className="flex items-center ml-auto">
                                    <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div>
                                    Online
                                </div>
                            </div>
                        );
                    })}
            </div>
        )
    );
};

export default PresenceList;
