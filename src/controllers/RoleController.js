import Role from "../models/Role.js";

export const isAdmin = async (roleId) => {
    const role = await Role.findById(roleId);
    return role.name === 'admin';
}

export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Create a new role
export const createRole = async (req, res) => {
    const { name, description, permissions } = req.body;
    const newRole = new Role({ name, description, permissions });
    try {
        await newRole.save();
        res.status(201).json(newRole);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update an existing role
export const updateRole = async (req, res) => {
    const { name, description, permissions } = req.body;
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, { name, description, permissions }, { new: true });
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Delete a role
export const deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        if(role.name === 'admin') {
            return res.status(400).json({ message: "Cannot delete admin role" });
        }
        
        res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}