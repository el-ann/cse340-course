-- ==========================================
-- Organizations Table
-- ==========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


-- ==========================================
-- Service Projects Table
-- Each project belongs to one organization (one-to-many)
-- ==========================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organization (organization_id)
);

INSERT INTO project (organization_id, title, description, location, date)
VALUES
-- BrightFuture Builders (organization_id = 1)
(1, 'Community Center Renovation', 'Repairing and repainting the local community center.', 'Springfield', '2027-03-10'),
(1, 'Playground Build', 'Constructing a new playground for the neighborhood park.', 'Springfield', '2027-04-05'),
(1, 'Road Safety Repairs', 'Fixing sidewalks and adding safety signage near schools.', 'Springfield', '2027-05-15'),
(1, 'Housing Repair Drive', 'Repairing homes for elderly residents in need.', 'Riverside', '2027-06-20'),
(1, 'Water System Upgrade', 'Improving local irrigation and water access.', 'Riverside', '2027-07-01'),

-- GreenHarvest Growers (organization_id = 2)
(2, 'Urban Garden Launch', 'Starting a new community garden in a vacant lot.', 'Downtown', '2027-03-12'),
(2, 'Composting Workshop', 'Teaching residents how to compost food waste.', 'Downtown', '2027-04-08'),
(2, 'Farmers Market Setup', 'Organizing a weekly farmers market for local growers.', 'Eastside', '2027-05-01'),
(2, 'School Garden Program', 'Building a teaching garden at a local elementary school.', 'Eastside', '2027-06-10'),
(2, 'Seed Distribution Day', 'Giving out free seeds and starter plants to families.', 'Downtown', '2027-07-05'),

-- UnityServe Volunteers (organization_id = 3)
(3, 'Food Bank Drive', 'Collecting and distributing food to families in need.', 'Westside', '2027-03-15'),
(3, 'Winter Coat Collection', 'Gathering warm clothing for the winter season.', 'Westside', '2027-04-01'),
(3, 'Senior Companionship Program', 'Pairing volunteers with elderly residents for visits.', 'Northside', '2027-05-20'),
(3, 'Tutoring Program', 'Providing free tutoring to local students.', 'Northside', '2027-06-15'),
(3, 'Community Cleanup Day', 'Organizing a neighborhood-wide litter cleanup.', 'Westside', '2027-07-08');


-- ==========================================
-- Categories Table
-- ==========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO category (name)
VALUES
('Construction'),
('Education'),
('Environment'),
('Community Support');


-- ==========================================
-- Project-Category Junction Table
-- Many-to-many relationship: a project can have multiple
-- categories, and a category can apply to multiple projects
-- ==========================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES project (project_id),
    FOREIGN KEY (category_id) REFERENCES category (category_id)
);

INSERT INTO project_category (project_id, category_id)
VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1),
(6, 3), (7, 3), (8, 3), (9, 2), (10, 3),
(11, 4), (12, 4), (13, 4), (14, 2), (15, 4);