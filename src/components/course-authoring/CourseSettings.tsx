import React from 'react';
import { Course } from '../../types/course';
import { Upload, Globe, DollarSign, Users, Award, Tag, Clock, BookOpen } from 'lucide-react';

interface CourseSettingsProps {
  course: Course;
  onUpdate: (course: Course) => void;
}

export function CourseSettings({ course, onUpdate }: CourseSettingsProps) {
  const updateCourse = (updates: Partial<Course>) => {
    onUpdate({ ...course, ...updates });
  };

  const updateInstructor = (updates: Partial<Course['instructor']>) => {
    onUpdate({
      ...course,
      instructor: { ...course.instructor, ...updates }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Settings</h2>
        <p className="text-gray-600">Configure your course details, pricing, and publishing options</p>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen size={20} />
          Basic Information
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title
              </label>
              <input
                type="text"
                value={course.title}
                onChange={(e) => updateCourse({ title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter course title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Emoji
              </label>
              <input
                type="text"
                value={course.emoji}
                onChange={(e) => updateCourse({ emoji: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="📚"
                maxLength={2}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Description
            </label>
            <textarea
              value={course.description}
              onChange={(e) => updateCourse({ description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Describe what students will learn in this course"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={course.category}
                onChange={(e) => updateCourse({ category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Programming">Programming</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Data Science">Data Science</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
                <option value="Photography">Photography</option>
                <option value="Music">Music</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={course.level}
                onChange={(e) => updateCourse({ level: e.target.value as any })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={course.language}
                onChange={(e) => updateCourse({ language: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Thumbnail URL
            </label>
            <div className="flex gap-4">
              <input
                type="url"
                value={course.thumbnail}
                onChange={(e) => updateCourse({ thumbnail: e.target.value })}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/thumbnail.jpg"
              />
              <button className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Upload size={16} />
                Upload
              </button>
            </div>
            {course.thumbnail && (
              <div className="mt-3">
                <img
                  src={course.thumbnail}
                  alt="Course thumbnail"
                  className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign size={20} />
          Pricing
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Price ($)
            </label>
            <input
              type="number"
              value={course.price}
              onChange={(e) => updateCourse({ price: parseFloat(e.target.value) || 0 })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="99.99"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Price ($) - Optional
            </label>
            <input
              type="number"
              value={course.originalPrice || ''}
              onChange={(e) => updateCourse({ originalPrice: parseFloat(e.target.value) || undefined })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="199.99"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        
        {course.originalPrice && course.originalPrice > course.price && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              Students will save ${(course.originalPrice - course.price).toFixed(2)} 
              ({Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% discount)
            </p>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Tag size={20} />
          Course Content & Skills
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills Students Will Learn (comma-separated)
            </label>
            <input
              type="text"
              value={course.skills.join(', ')}
              onChange={(e) => updateCourse({ skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="React, JavaScript, Node.js, MongoDB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={course.tags.join(', ')}
              onChange={(e) => updateCourse({ tags: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="frontend, react, javascript, web-development"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Requirements (one per line)
            </label>
            <textarea
              value={course.requirements.join('\n')}
              onChange={(e) => updateCourse({ requirements: e.target.value.split('\n').filter(s => s.trim()) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Basic JavaScript knowledge&#10;Computer with internet connection&#10;Willingness to learn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What Students Will Learn (one per line)
            </label>
            <textarea
              value={course.whatYouWillLearn.join('\n')}
              onChange={(e) => updateCourse({ whatYouWillLearn: e.target.value.split('\n').filter(s => s.trim()) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Build modern React applications&#10;Master React Hooks and Context API&#10;Create responsive user interfaces&#10;Deploy applications to production"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience (one per line)
            </label>
            <textarea
              value={course.targetAudience.join('\n')}
              onChange={(e) => updateCourse({ targetAudience: e.target.value.split('\n').filter(s => s.trim()) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Frontend developers&#10;JavaScript developers looking to learn React&#10;Web developers wanting to advance their skills"
            />
          </div>
        </div>
      </div>

      {/* Instructor Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={20} />
          Instructor Information
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructor Name
              </label>
              <input
                type="text"
                value={course.instructor.name}
                onChange={(e) => updateInstructor({ name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={course.instructor.avatar}
                onChange={(e) => updateInstructor({ avatar: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={course.instructor.bio}
              onChange={(e) => updateInstructor({ bio: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Brief bio about the instructor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credentials (comma-separated)
            </label>
            <input
              type="text"
              value={course.instructor.credentials.join(', ')}
              onChange={(e) => updateInstructor({ credentials: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Senior Developer, 10+ Years Experience, React Expert"
            />
          </div>
        </div>
      </div>

      {/* Publishing Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe size={20} />
          Publishing Options
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={course.certificate}
                onChange={(e) => updateCourse({ certificate: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Offer completion certificate</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={course.published}
                onChange={(e) => updateCourse({ published: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Publish course (make it available to students)</span>
            </label>
          </div>

          {course.published && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <Globe size={16} />
                <span className="font-semibold">Course is Published</span>
              </div>
              <p className="text-green-700 text-sm">
                Your course is live and available for students to enroll. 
                {course.publishedAt && ` Published on ${new Date(course.publishedAt).toLocaleDateString()}.`}
              </p>
            </div>
          )}

          {!course.published && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800 mb-2">
                <Clock size={16} />
                <span className="font-semibold">Course is in Draft</span>
              </div>
              <p className="text-yellow-700 text-sm">
                Your course is not yet published. Students cannot see or enroll in this course until you publish it.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Award size={18} />
          Save Course Settings
        </button>
      </div>
    </div>
  );
}