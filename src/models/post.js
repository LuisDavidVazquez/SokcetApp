import { Schema, model, models } from "mongoose";

const comentsSchema = new Schema ({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "El id del usuario es requerido"],
    },
    content: {
        type: String,
        required: [true, "La descripcion es requerida"],
    }
})

const postSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "El id del usuario es requerido"],
    },
    fecha: {
        type: String,
        required: [true, "La fecha es requerida"],
    },
    content: {
        type: String,
        required: [true, "El contenido es requerido"],
    },
    comments: [comentsSchema]
},
    {
        timestamps: false,
        versionKey: false,
    }
);

export default models.post || model("post", postSchema);