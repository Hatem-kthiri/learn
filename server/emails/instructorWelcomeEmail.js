/**
 * Welcome email sent to newly-created instructors with their login credentials.
 */
const instructorWelcomeEmail = ({ firstName, lastName, email, password }) => `Hello ${firstName} ${lastName},

Your Instructor account has been created. Here are your login details:

Email: ${email}
Password: ${password}

Please login to the platform using these credentials.

Best regards,
The Admin`;

module.exports = instructorWelcomeEmail;
