import { NextResponse } from 'next/server';
import { connectionDB } from '@/libs/mongodb'
import Post from "@/models/post";

export async function POST(request) {
    connectionDB();
    const { user_id, fecha, content }  = await request.json();
    console.log(user_id, fecha, content );
    try {
        
        const post = new Post({
            user_id,
            fecha,
            content
        })
        const postSaved = await post.save();
        console.log(postSaved)

        return NextResponse.json(postSaved)
    } catch (error) {
        console.log(error)
        return NextResponse.json(error)
    }
}

