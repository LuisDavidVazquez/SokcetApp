import { NextResponse } from 'next/server';
import { connectionDB } from '@/libs/mongodb'
import User from "@/models/user";

export async function GET(request, { params }) {
    const id = params.id
    connectionDB();
    try {
        const userFound = await User.findById(id)
        const usersFound = await User.find({
            _id: { $nin: userFound.followers}
        });
        return NextResponse.json(usersFound);
    } catch (error) {
        console.log(error);
        return NextResponse.json(error);
    }
}