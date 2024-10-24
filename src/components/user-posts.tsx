'use client'

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import dayjs from "@/libs/dayjs";
import React, {useEffect} from "react";
import {createHash} from "crypto";
import {Post} from "@prisma/client";
import {createPost} from "@/controllers/post";
import {SubmitHandler, useForm} from "react-hook-form";
import {usePusher} from "@/components/hooks/use-pusher";

type PostWithUser = Post & {
    user: {
        name: string;
        email: string;
        image: string | null;
    };
};

type Inputs = {
    content: string;
};

const UserPosts = ({posts, loggedInUser}: {
    posts: PostWithUser[],
    loggedInUser: { id: string; name: string | null; email: string; image: string | null; } | null
}) => {
    const [userPosts, setUserPosts] = React.useState<PostWithUser[]>(posts);
    const pusher = usePusher();

    const emailHash = createHash("md5")
        .update(loggedInUser?.email?.trim().toLowerCase() || "")
        .digest("hex");
    let imageUrl = loggedInUser?.image || `https://www.gravatar.com/avatar/${emailHash}?d=mp`;

    const {
        register,
        handleSubmit,
        reset
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async ({content}) => {
        await createPost((loggedInUser?.email as string), content);
        reset();
    };

    useEffect(() => {
        const channel = pusher?.subscribe("posts");

        channel?.bind("new-post", (post: PostWithUser) => {
            setUserPosts([post, ...userPosts]);
        });

        return () => {
            pusher?.unbind("new-post");
            channel?.unbind_all();
            channel?.unsubscribe();
        };
    }, [pusher, userPosts]);

    return (
        <>
            <Card className="flex items-center bg-white shadow-md p-4 rounded-md">
                <div className="w-10 h-10 mr-3 rounded-full overflow-hidden">
                    <img
                        src={imageUrl}
                        alt="Profile" className="w-full h-full object-cover"
                    />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                    <Input
                        required
                        {...register("content")}
                        className="w-full bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-full px-4 py-2 text-gray-600"
                        placeholder={`A cosa stai pensando ${loggedInUser?.name}?`}
                    />
                </form>
            </Card>

            <div className="space-y-4 mt-8">
                {userPosts.map((post: PostWithUser) => {
                    const emailHash = createHash("md5")
                        .update(post.user.email.trim().toLowerCase() || "")
                        .digest("hex");
                    let imageUrl = post.user.image || `https://www.gravatar.com/avatar/${emailHash}?d=mp`;

                    return (
                        <Card key={post.id} className="shadow-md">
                            <CardHeader className="border-gray-200">
                                <div className="flex items-center">
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
                                        <h2 className="font-medium text-lg">{post.user.name}</h2>
                                        <p className="text-gray-400">{(dayjs(post.createdAt) as any).fromNow()}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p>{post.content}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </>
    )
}

export default UserPosts;