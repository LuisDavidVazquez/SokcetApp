import { NextResponse } from 'next/server';
import { connectionDB } from '@/libs/mongodb';
import User from "@/models/user";

export async function GET(request, { params }) {
    const id = params.id; 
    connectionDB();
    try {
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json("Usuario no encontrado", { status: 404 });
        }
        const followers = await User.find({
            _id: { $in: user.followers, $ne: id },
        }, { name: 1, email: 1, online: 1 });
        return NextResponse.json(followers);
    } catch (error) {
        console.log(error);
        return NextResponse.json(error);
    }
}
