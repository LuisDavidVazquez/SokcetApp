import { NextResponse } from 'next/server';
import { connectionDB } from '@/libs/mongodb'
import User from "@/models/user";

export async function PUT(request) {
    connectionDB();
    const data  = await request.json();
    console.log(data.id_follower, data.id);
    try {
        const newFollower = await User.updateOne(
            { _id: data.id },
            { $push: { followers: data.id_follower } },
            {
                new: true,
            }
        )
        return NextResponse.json(newFollower)
    } catch (error) {
        console.log(error)
        return NextResponse.json(error)
    }
}
