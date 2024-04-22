import { NextResponse } from 'next/server';
import { connectionDB } from '@/libs/mongodb'
import Post from "@/models/post";

export async function PUT(request) {
    connectionDB();
    const { user_id, post_id, content } = await request.json();
    console.log( user_id, post_id, content);
    try {
        const newComment = await Post.updateOne(
            { _id: post_id },
            {
                $push:
                {
                    comments: {
                        user_id: user_id,
                        content : content
                    }
                }
            },
            {
                new: true,
            }
        )
        return NextResponse.json(newComment)
    } catch (error) {
        console.log(error)
        return NextResponse.json(error)
    }
}

