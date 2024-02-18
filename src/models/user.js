import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es requerido"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El correo es requerido"],
        validate: {
            validator: function (value) {
                const emailPattern = /@(gmail\.com|hotmail\.com|outlook\.es)$/i;
                return emailPattern.test(value);
            },
            message: "El formato del correo electrónico no es válido.",
        },
    },
    password: {
        type: String,
        required: [true, "La contraseña es requerida"],
        minlength: [8, "La contraseña debe tener al menos 8 caracteres."]
    },
    online : {
        type: Boolean,
    },
    followers: [{
        type: Schema.Types.ObjectId,
        required: false,
    }]
},
    {
        timestamps: false,
        versionKey: false,
    }
);

export default models.user || model("user", userSchema);