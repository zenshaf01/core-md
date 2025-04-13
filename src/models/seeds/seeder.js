import Role from '../Role.js';
import { seedAdmin } from '../../controllers/AuthController.js';
import roles from './RoleSeed.js';

/**
 * Seed Roles Collection
 * @returns 
 */
const seedRoles = async () => {
    try {
        console.log('Seeding roles...');
        const existingRoles = await Role.find();
        if (existingRoles.length > 0) {
            console.log('Database already seeded with roles...');
            return;
        }

        await Role.insertMany(roles);
        console.log('Roles seeded successfully.');
    } catch (error) {
        console.error('Error seeding roles:', error);
        throw error;
    }
}

/**
 * Seed the database with initial data
 */
const seedData = async () => {
    await seedRoles();
    await seedAdmin();
};

export default seedData;