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

export function subscribeClient(client) {
    // Agrega el cliente a la lista de suscritos
    clients.push(client);
}

export function unsubscribeClient(client) {
    // Remueve el cliente de la lista de suscritos
    const index = clients.indexOf(client);
    if (index !== -1) {
        clients.splice(index, 1);
    }
}

