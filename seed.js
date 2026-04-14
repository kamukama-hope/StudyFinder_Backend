const sequelize = require('./config/database');
const User = require('./models/User');
const Group = require('./models/Group');

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connection established and database synced.');
    
    // Check if user exists
    let user = await User.findOne({ where: { email: 'kevin@example.com' } });
    if (!user) {
      user = await User.create({
        name: 'Kevin',
        email: 'kevin@example.com',
        password: 'password123', // In a real app, hash this!
        role: 'admin'
      });
      console.log('User created.');
    }

    // Check if group exists
    const groupCount = await Group.count();
    if (groupCount === 0) {
      await Group.create({
        groupName: 'Web Development',
        courseName: 'Web & Mobile App Dev',
        courseCode: 'CSC1202',
        faculty: 'Computing',
        description: 'Learning React and Node.js',
        meetingLocation: 'FET Lab B',
        meetingType: 'physical',
        leaderId: user.id
      });
      await Group.create({
        groupName: 'Data Science',
        courseName: 'Data Analytics',
        courseCode: 'DSC3101',
        faculty: 'Computing',
        description: 'Big data and machine learning',
        meetingLocation: 'Library Room 4',
        meetingType: 'physical',
        leaderId: user.id
      });
      console.log('Seed groups created.');
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
