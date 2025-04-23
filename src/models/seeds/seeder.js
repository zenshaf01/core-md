import Role from '../Role.js';
import User from '../User.js';
import roles from './RoleSeed.js';
import homeOrganization from './OrganizationSeed.js';
import Organization from '../Organization.js';
import { seedAdmin } from '../../controllers/AuthController.js';

/**
 * Seed Organization Collection
 */
const seedOrganization = async () => {
    try {
        console.log('Seeding default organization...');
        const existingOrganizations = await Organization.find();
        if (existingOrganizations.length > 0) {
            console.log('Database already seeded with default organization...');
            return;
        }
        const superAdminRole = await Role.findOne({ name: 'super-admin' });
        if (!superAdminRole) {
            console.log('Super admin role not found. Please create the super admin role first.');
            return;
        }

        const adminUser = await User.findOne({ role: superAdminRole._id });
        if (!adminUser) {
            console.log('No admin user found. Please create an admin user first.');
            return;
        }

        homeOrganization.organizationOwner = adminUser._id;
        homeOrganization.organizationAdmin = adminUser._id;

        await Organization.insertOne(homeOrganization);
        console.log('default organization seeded successfully.');
    } catch (error) {
        console.error('Error seeding default organization:', error);
        throw error;
    }
}

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
    await seedOrganization();
};

export default seedData;