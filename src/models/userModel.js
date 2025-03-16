/*****************************************************
 * models/userModel.js
 * ---------------------------------
 * Mock user data and retrieval function.
 * In a real project, you'd integrate with a DB.
 *****************************************************/

const USERS_DB = [
    { id: 'user-1', username: 'sarah', passwordHash: '', verified: true },
    { id: 'user-2', username: 'john', verified: false }
    // You can add more users as needed
];

// For demonstration, we'll simulate a simple "getUserByUsername"
function getUserByUsername(username) {
    return USERS_DB.find(u => u.username === username);
}

module.exports = {
    getUserByUsername
};
