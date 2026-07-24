// Import any needed model functions
import { getAllCategories, getCategoryDetails, getProjectsByCategoryId, updateCategoryAssignments } from '../models/categories.js';
import { getProjectDetails, getCategoriesByServiceProjectId } from '../models/projects.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);
    const title = 'Category Details';

    res.render('category', { title, categoryDetails, projects });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const project = await getProjectDetails(projectId);
    const allCategories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);
    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, project, allCategories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    let { categoryIds } = req.body;

    // Ensure categoryIds is always an array, even if only one checkbox was selected
    if (!categoryIds) {
        categoryIds = [];
    } else if (!Array.isArray(categoryIds)) {
        categoryIds = [categoryIds];
    }

    await updateCategoryAssignments(projectId, categoryIds);
    req.flash('success', 'Categories updated successfully!');
    res.redirect(`/project/${projectId}`);
};

// Export any controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};