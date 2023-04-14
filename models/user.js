import { Schema, model } from'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema ({
    name: {
        type: String,
        required: true,
        allowBlank: false,
        minlength: 3,
    },
    email: {
        type: String,//mongoose.SchemaTypes.Email,
        unique: true,
        required: true,
        allowBlank: false,
        minlength: 10
    }, 
    password: {
        type: String,
        minlength: 8,
        required: true,
        allowBlank: false
    },
    img: {
        type: String,
        allowBlank: true,
        default: null
    },
    token: String,
    key: {
        type: String,
        default: null
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
});

UserSchema.pre('save', async function() {
    const user = this;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

const User = model('user', UserSchema);

User.prototype.validatePassword = async function(password, hash) {
    const match = await bcrypt.compare(password, hash);
    return match;
}

export default User;