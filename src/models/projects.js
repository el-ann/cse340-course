import db from './db.js'

const getAllProjects = async () => {
    const query = `
        SELECT project.project_id, project.title, project.description, 
               project.location, project.date, organization.name AS organization_name
        FROM project
        JOIN organization ON project.organization_id = organization.organization_id;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            project.project_id,
            project.title,
            project.description,
            project.date,
            project.location,
            project.organization_id,
            organization.name AS organization_name
        FROM project
        JOIN organization ON project.organization_id = organization.organization_id
        WHERE project.date >= CURRENT_DATE
        ORDER BY project.date ASC
        LIMIT $1;
    `;

    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            project.project_id,
            project.title,
            project.description,
            project.date,
            project.location,
            project.organization_id,
            organization.name AS organization_name
        FROM project
        JOIN organization ON project.organization_id = organization.organization_id
        WHERE project.project_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByServiceProjectId = async (projectId) => {
    const query = `
        SELECT
            category.category_id,
            category.name
        FROM category
        JOIN project_category ON category.category_id = project_category.category_id
        WHERE project_category.project_id = $1;
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

/**
 * Creates a new service project in the database.
 * @param {string} title - The title of the project.
 * @param {string} description - The description of the project.
 * @param {string} location - The location of the project.
 * @param {string} date - The date of the project.
 * @param {string} organizationId - The ID of the organization sponsoring the project.
 * @returns {string} The id of the newly created project record.
 */
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO project (title, description, location, date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    return result.rows[0].project_id;
};

/**
 * Updates an existing service project in the database.
 * @param {string} id - The ID of the project to update.
 * @param {string} title - The updated title of the project.
 * @param {string} description - The updated description of the project.
 * @param {string} location - The updated location of the project.
 * @param {string} date - The updated date of the project.
 * @param {string} organizationId - The updated organization ID for the project.
 */
const updateProject = async (id, title, description, location, date, organizationId) => {
    const query = `
        UPDATE project
        SET title = $2, description = $3, location = $4, date = $5, organization_id = $6
        WHERE project_id = $1
        RETURNING project_id;
    `;

    const queryParams = [id, title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to update project');
    }
};

export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, getCategoriesByServiceProjectId, createProject, updateProject }