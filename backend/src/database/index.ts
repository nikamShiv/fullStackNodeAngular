import { connection } from './connection';

// Test database connection
connection.authenticate()
    .then(() => console.log('Connection established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

// Synchronize models
connection.sync({force:false})
    .then(() => console.log('Database synchronized.'))
    .catch(err => console.error('Error synchronizing the database:', err));

export { connection };
