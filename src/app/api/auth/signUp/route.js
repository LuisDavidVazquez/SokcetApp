import { NextResponse } from 'next/server';
import { connectionDB } from '@/libs/mongodb'
import User from "@/models/user";
import bcrypt from 'bcryptjs'

export async function POST(request) {
    connectionDB();
    try {
        const { name, email, password} = await request.json();
        console.log(name, email, password);

        const emailPattern = /@(gmail\.com|hotmail\.com|outlook\.es)$/i;
        if (!email.match(emailPattern)) {
            return NextResponse.json({
                error: "El formato del correo electrónico no es válido.",
            })
        }

        const userFound = await User.findOne({ email });
        if (userFound) {0
            return NextResponse.json({
                error: "Email ya existe",
                message: "El formato del correo electrónico no es válido.",
            })
        }

        if (!password || password.length < 8) {
            return NextResponse.json({
                error: "La contraseña tiene menos de 8 caracteres"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({
            name,
            email,
            password: hashedPassword,
            online: false,
        })
        const userSaved = await user.save();
        console.log(userSaved)

        await User.updateOne(
            { _id: userSaved._id},
            { $push: { followers: userSaved._id} },
            {
                new: true,
            }
        )
        return NextResponse.json(userSaved)
    } catch (error) {
        console.log(error)
        return NextResponse.json(error)
    }
}

export async function PUT(request, { params }) {
    try {
      const data = await request.json();
      const updateOnline = await User.findByIdAndUpdate(
        data.id,
        { online: data.online },
        {
          new: true,
        }
      );
      return NextResponse.json(updateOnline);
    } catch (error) {
      return NextResponse.json(error.message, {
        status: 400,
      });
    }
  }
