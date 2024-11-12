# Frontend

This **Frontend** application is part of the AI Aizent project, designed to provide a responsive and interactive user interface for interacting with backend APIs and the Strapi CMS. It leverages modern technologies to deliver a seamless user experience, including features like newsletter subscriptions, agent details display, blog creation, and administrative dashboards.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **React Router**: For client-side routing.
- **Axios**: HTTP client for making API requests.
- **Framer Motion**: Animation library for React.
- **React Icons**: Icon library for React applications.
- **Styled Components**: CSS-in-JS styling.
- **Formik**: Form management library.
- **Yup**: Schema validation for forms.
- **Tailwind CSS**: Utility-first CSS framework.
- **Parcel**: Bundler for building the project.
- **Other Dependencies**: Listed in `package.json`.

## Features

- **Responsive Design**: Ensures compatibility across various devices and screen sizes.
- **Newsletter Subscription**: Allows users to subscribe for updates.
- **Agent Details**: Displays detailed information about agents, including key features and use cases.
- **Blog Creation**: Provides a form for creating and submitting blog posts with rich content.
- **Admin Dashboard**: Administrative interface for managing agents and other resources.
- **Contact Form**: Enables users to reach out with inquiries.
- **User Authentication**: Handles user login, signup, and password management.
- **Animations**: Smooth animations and transitions for enhanced user experience.
- **Form Validation**: Ensures data integrity through robust validation mechanisms.
- **Image Uploads**: Supports uploading and previewing images for agents and blogs.
- **API Integration**: Seamless interaction with backend APIs and Strapi CMS.

## Prerequisites

- **Node.js** (v14.x or higher)
- **npm** or **yarn**
- **Backend API** and **Strapi CMS** deployed and accessible
- **Environment Variables** configured (as detailed below)

## Installation

1. **Clone the Repository**

   ```bash
   git clone <YOUR_REPO_URL>
   cd frontend
   
2. **Install Dependencies**

   ```bash
   npm install


## Running the Application

    
      npm start
 The application will be available at http://localhost:1234.





## Scripts



- **`start`**: Runs the development server using Parcel.
- **`build`**: Builds the application for production.

## Deployment

To build the application for production deployment:
    
   npm run build



---

### Project Structure
```markdown
## Project Structure

```plaintext
frontend/
├── public/
│   └── index.html
├── src/
│   ├── Components/
│   │   ├── BlogForm.js
│   │   ├── NewAgentForm/
│   │   │   └── Agentform.js
│   │   ├── Contact/
│   │   │   └── Contact.js
│   │   └── Footer/
│   │       └── Footer.js
│   ├── Admin/
│   │   ├── AdminDashboard.css
│   │   └── AdminDashboard.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── Images/
│   ├── AgentDetail.js
│   ├── AllAgents.js
│   ├── App.js
│   ├── index.js
│   ├── Navbar.js
│   ├── Body/
│   │   └── Body.js
│   ├── ScrollToTop.js
│   ├── Map.js
│   ├── Admin/
│   │   └── AdminDash.js
│   ├── User/
│   │   ├── Login/
│   │   │   └── login.js
│   │   ├── UserSignUp/
│   │   │   └── signup.js
│   │   ├── ForgotPassword/
│   │   │   └── ForgotPassword.js
│   │   └── ResetPassword/
│   │       └── ResetPassword.js
│   └── ... (other components and files)
├── .env
├── package.json
├── parcel-config.js (if any)
├── tailwind.config.js
├── postcss.config.js
└── README.md


