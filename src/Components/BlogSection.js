import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BlogSection = ({ 
    id, 
    index, 
    section, 
    updateSection, 
    removeSection, 
    errors 
}) => {
    const handleTitleChange = (e) => {
        updateSection(id, { title: e.target.value });
    };

    const handleContentChange = (value) => {
        updateSection(id, { content: value });
    };

    return (
        <div className="mb-6 p-4 border rounded-lg bg-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Section {index + 1}</h3>
                <button
                    type="button"
                    onClick={() => removeSection(id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Remove Section ${index + 1}`}
                >
                    <FaTrash />
                </button>
            </div>

            <div className="mb-4">
                <label htmlFor={`section-content-${id}`} className="block text-gray-700 mb-2">
                    Content
                </label>
                <ReactQuill
                    theme="snow"
                    value={section.content}
                    onChange={handleContentChange}
                    className={`mb-2 border rounded ${
                        errors && errors.content ? 'border-red-500' : 'border-gray-300'
                    }`}
                    modules={{
                        toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                            ['link', 'image', 'video'],
                            [{ 'align': [] }], // Alignment options
                            ['clean']
                        ],
                    }}
                    formats={[
                        'header',
                        'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'list', 'bullet', 'indent',
                        'link', 'image', 'video',
                        'align' // Add align format
                    ]}
                    placeholder="Write section content here..."
                />
                {errors && errors.content && (
                    <div className="text-red-500 text-sm mt-1">{errors.content}</div>
                )}
            </div>
        </div>
    );
};

export default BlogSection;
