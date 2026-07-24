import db from './db.js'

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM category
        WHERE category_id = $1;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
}

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            project.project_id,
            project.title
        FROM project
        JOIN project_category ON project.project_id = project_category.project_id
        WHERE project_category.category_id = $1
        ORDER BY project.date;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows;
}

const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO project_category (project_id, category_id)
        VALUES ($1, $2);
    `;

    const queryParams = [projectId, categoryId];
    await db.query(query, queryParams);
};

/**
 * Updates the categories assigned to a project.
 * Removes all previous assignments, then adds the new ones.
 * @param {string} projectId - The ID of the project.
 * @param {Array} categoryIds - Array of category IDs to assign to the project.
 */
const updateCategoryAssignments = async (projectId, categoryIds) => {
    // Remove all existing category assignments for this project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};

/**
 * Creates a new category in the database.
 * @param {string} name - The name of the category.
 * @returns {string} The id of the newly created category record.
 */
const createCategory = async (name) => {
    const query = `
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING category_id
    `;

    const queryParams = [name];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    return result.rows[0].category_id;
};

/**
 * Updates an existing category in the database.
 * @param {string} id - The ID of the category to update.
 * @param {string} name - The updated name of the category.
 */
const updateCategory = async (id, name) => {
    const query = `
        UPDATE category
        SET name = $2
        WHERE category_id = $1
        RETURNING category_id;
    `;

    const queryParams = [id, name];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to update category');
    }
};

export { getAllCategories, getCategoryDetails, getProjectsByCategoryId, updateCategoryAssignments, createCategory, updateCategory }