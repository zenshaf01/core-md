const roleSeed = [
    {
        name: 'admin',
        description: 'Administrator with full access.',
        permissions: [
            'course:create,read,update,delete',
            'module:create,read,update,delete',
            'lecture:create,read,update,delete',
            'user:create,read,update,delete',
            'role:create,read,update,delete',
            'self:read,update'
        ]
    }];

export default roleSeed;