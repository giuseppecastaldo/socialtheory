import React from 'react';
import {getPosts} from "@/controllers/post";
import PresenceList from "@/components/presence-list";
import {auth} from "@/libs/auth";
import UserPosts from "@/components/user-posts";
import {Post} from "@prisma/client";
import {getUserById} from "@/controllers/user";

type PostWithUser = Post & {
    user: {
        name: string;
        email: string;
        image: string | null;
    };
};

const PostsPage = async () => {
    const userPosts = await getPosts();
    const loggedInUser = await auth();
    const user = await getUserById(loggedInUser?.user?.id as string);

    return (
        <div className="flex flex-col lg:flex-row h-screen">
            <div className="w-full lg:w-1/4 p-4 border-b lg:border-b-0 lg:border-r">
                <PresenceList/>
            </div>

            <div className="flex-1 bg-white p-4">
                <UserPosts posts={userPosts as PostWithUser[]} loggedInUser={user}/>
            </div>
        </div>
    );
};

export default PostsPage;