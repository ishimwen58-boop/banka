const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'ishimwen58@gmail.com';
        const password = 'banka123';
        const firstName = 'Ishimwe';
        const lastName = 'Noella';

        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('Admin user already exists');
            // Update to ensure role is admin and isVerified is true
            userExists.role = 'admin';
            userExists.isVerified = true;
            userExists.isActive = true;
            userExists.firstName = firstName;
            userExists.lastName = lastName;
            // Only update password if you want to force reset it, but hashing might be tricky if not going through save hook properly or if we just save. 
            // Let's just update role/status.
            await userExists.save();
            console.log('Admin user updated');
        } else {
            await User.create({
                firstName,
                lastName,
                email,
                password,
                role: 'admin',
                isVerified: true,
                isActive: true
            });
            console.log('Admin user created');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
