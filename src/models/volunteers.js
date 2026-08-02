import db from './db.js'

const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING;
    `;

    const queryParams = [userId, projectId];
    await db.query(query, queryParams);
};

const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;

    const queryParams = [userId, projectId];
    await db.query(query, queryParams);
};

const isVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1
        FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;

    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0;
};

const getVolunteeredProjectsByUserId = async (userId) => {
    const query = `
        SELECT project.project_id, project.title, project.date
        FROM project
        JOIN volunteer ON project.project_id = volunteer.project_id
        WHERE volunteer.user_id = $1
        ORDER BY project.date;
    `;

    const queryParams = [userId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

export { addVolunteer, removeVolunteer, isVolunteering, getVolunteeredProjectsByUserId };