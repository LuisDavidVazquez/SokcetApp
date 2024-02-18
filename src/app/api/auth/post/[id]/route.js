import { NextResponse } from 'next/server';
import { connectionDB } from '@/libs/mongodb';
import User from "@/models/user";
import Post from "@/models/post";

export async function GET(request, { params }) {
    const id = params.id; 
    connectionDB();
    try {
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json("Usuario no encontrado", { status: 404 });
        }
        const followers = user.followers;

        const posts = await Post.find({
           user_id: { $in: followers},
        }).populate("user_id", "name", User);
        return NextResponse.json(posts);
    } catch (error) {
        console.log(error);
        return NextResponse.json(error);
    }
}
