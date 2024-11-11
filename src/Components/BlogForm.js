// src/Components/BlogForm.js

import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import BlogSection from './BlogSection';
import { FaPlus } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Custom Upload Adapter Plugin
function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new CustomUploadAdapter(loader, '/blogs/upload-image'); // Updated endpoint to include '/api'
  };
}

// Custom Upload Adapter Class
class CustomUploadAdapter {
  constructor(loader, uploadUrl) {
    this.loader = loader;
    this.uploadUrl = uploadUrl;
  }

  // Starts the upload process
  upload() {
    return this.loader.file
      .then((file) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append('image', file); // The key 'image' should match the backend expectation

          axios
            .post(this.uploadUrl, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((response) => {
              resolve({
                default: response.data.url, // Use the URL returned from the server
              });
            })
            .catch((error) => {
              console.error('Upload Error:', error);
              reject(error);
            });
        })
      );
  }

  // Aborts the upload process
  abort() {
    // Implement abort functionality if needed
  }
}

const BlogForm = () => {
  const navigate = useNavigate();

  // Initialize AOS once when the component mounts
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Whether animation should happen only once
    });
  }, []);

  // Define initial form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [mainImage, setMainImage] = useState(null); // State for Main Image
  const [sections, setSections] = useState([
    {
      id: uuidv4(),
      title: '',
      content: '',
      images: [], // Existing images' public_ids to keep (if editing)
      newImages: [], // New image files to upload
    },
  ]);

  // Define form errors
  const [errors, setErrors] = useState({});

  // Handle adding a new section
  const addSection = () => {
    setSections([
      ...sections,
      {
        id: uuidv4(),
        title: '',
        content: '',
        images: [],
        newImages: [],
      },
    ]);
  };

  // Handle removing a section by id
  const removeSection = (id) => {
    const updatedSections = sections.filter((section) => section.id !== id);
    setSections(updatedSections);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form.');
      return;
    }

    try {
      // Prepare sections data, including the section's id
      const sectionsData = sections.map((section) => ({
        id: section.id, // Include the unique id
        title: section.title,
        content: section.content,
        images: section.images.map((img) => img.public_id), // Existing images' public_ids
        // newImages are handled as separate files
      }));

      // Prepare FormData
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('tags', tags);
      formData.append('category', category);
      formData.append('sections', JSON.stringify(sectionsData));

      // Append Main Image if selected
      if (mainImage) {
        formData.append('mainImage', mainImage);
      }

      // Append all new image files with proper field names
      sections.forEach((section) => {
        section.newImages.forEach((file) => {
          // Use the section's id to uniquely identify images
          formData.append(`sections[${section.id}].newImages`, file);
        });
      });

      // Debugging: Log FormData entries (Optional: Remove in production)
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      // **Do not set the 'Content-Type' header manually**
      await axios.post('/blogs', formData); // Updated endpoint to include '/api'

      // Show success toast notification
      toast.success('Blog created successfully!');

      // Reset the form
      resetForm();

      // Navigate to the blogs listing page
      navigate('/blogs');
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to create blog. Please try again.');
    }
  };

  // Validate the form fields
  const validateForm = () => {
    const errors = {};

    // Validate title
    if (!title.trim()) {
      errors.title = 'Title is required';
    } else if (title.length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }

    // Validate content
    if (!content || content === '<p><br></p>') {
      errors.content = 'Content is required';
    }

    // Validate category
    if (!category.trim()) {
      errors.category = 'Category is required';
    }

    // Validate main image (optional but can add constraints)
    // Uncomment and adjust if you want to enforce constraints
    /*
    if (mainImage) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(mainImage.type)) {
        errors.mainImage = 'Only JPEG, PNG, and GIF images are allowed for the main image';
      }
      if (mainImage.size > 5 * 1024 * 1024) { // 5MB limit
        errors.mainImage = 'Main image size cannot exceed 5MB';
      }
    }
    */

    // Validate sections
    const sectionErrors = sections.map((section) => {
      const secErrors = {};
      if (!section.title.trim()) {
        secErrors.title = 'Section title is required';
      }
      if (!section.content || section.content === '<p><br></p>') {
        secErrors.content = 'Section content is required';
      }
      // Optionally, validate section images
      return secErrors;
    });

    sectionErrors.forEach((secError, idx) => {
      if (Object.keys(secError).length > 0) {
        if (!errors.sections) errors.sections = {};
        errors.sections[sections[idx].id] = secError; // Use section's id as the key
      }
    });

    return errors;
  };

  // Reset the form fields
  const resetForm = () => {
    setTitle('');
    setContent('');
    setTags('');
    setCategory('');
    setMainImage(null);
    setSections([
      {
        id: uuidv4(),
        title: '',
        content: '',
        images: [],
        newImages: [],
      },
    ]);
    setErrors({});
  };

  // Handler to update a specific section by id
  const updateSection = (id, updatedSection) => {
    setSections((prevSections) => {
      return prevSections.map((section) => {
        if (section.id === id) {
          return {
            ...section,
            ...updatedSection,
          };
        }
        return section;
      });
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold mb-6 text-primaryBlue2 text-center" data-aos="fade-up">
        Add New Blog
      </h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg"
        data-aos="fade-up"
      >
        {/* Title Field */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter blog title"
          />
          {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
        </div>

        {/* Main Image Upload */}
        <div className="mb-4">
          <label htmlFor="mainImage" className="block text-gray-700 mb-2">
            Main Image
          </label>
          <input
            type="file"
            id="mainImage"
            accept="image/*"
            onChange={(e) => setMainImage(e.target.files[0])}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.mainImage ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-label="Upload main image for the blog"
          />
          {errors.mainImage && <div className="text-red-500 text-sm mt-1">{errors.mainImage}</div>}

          {/* Display Main Image Preview */}
          {mainImage && (
            <div className="mt-4">
              <p className="text-gray-700 mb-2">Main Image Preview:</p>
              <img
                src={URL.createObjectURL(mainImage)}
                alt="Main Preview"
                className="w-48 h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Content Field with CKEditor */}
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 mb-2 ">
            Content
          </label>
          <div className="custom-editor">
  <CKEditor
    editor={ClassicEditor}
    data={content}
    onReady={(editor) => {
      console.log('Editor is ready to use!', editor);
    }}
    onChange={(event, editor) => {
      const data = editor.getData();
      setContent(data);
    }}
    config={{
      extraPlugins: [CustomUploadAdapterPlugin],
      toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        '|',
        'link',
        'imageUpload',
        'image',
        'video',
        '|',
        'bulletedList',
        'numberedList',
        'indent',
        'outdent',
        '|',
        'insertTable',
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        '|',
        'undo',
        'redo',
      ],
      image: {
        toolbar: ['imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative'],
        styles: ['full', 'side'],
      },
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
      },
    }}
    className={`mb-2 border rounded ${
      errors.content ? 'border-red-500' : 'border-gray-300'
    }`}
  />
</div>


          {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}
        </div>

        {/* Tags Field */}
        <div className="mb-4">
          <label htmlFor="tags" className="block text-gray-700 mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., technology, ai, machine learning"
          />
        </div>

        {/* Category Field */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 mb-2">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter blog category"
          />
          {errors.category && <div className="text-red-500 text-sm mt-1">{errors.category}</div>}
        </div>

       
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Sections</label>
          {sections.map((section, index) => (
            <BlogSection
              key={section.id}
              id={section.id} // Pass the unique id
              index={index}
              section={section}
              setSections={setSections}
              updateSection={updateSection}
              removeSection={removeSection}
              errors={errors.sections && errors.sections[section.id]}
            />
          ))}

          <button
            type="button"
            onClick={addSection}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition mt-4"
            aria-label="Add New Section"
          >
            <FaPlus className="mr-2" />
            Add New Section
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primaryBlue2 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
