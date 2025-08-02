import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PencilIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      skills: user?.skills?.join(', ') || '',
      experience: user?.experience || '',
      currentPosition: user?.currentPosition || '',
      company: user?.company || '',
      linkedinProfile: user?.linkedinProfile || ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Convert skills string back to array
      const formattedData = {
        ...data,
        skills: data.skills ? data.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : []
      };

      const result = await updateProfile(formattedData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      name: user?.name || '',
      bio: user?.bio || '',
      skills: user?.skills?.join(', ') || '',
      experience: user?.experience || '',
      currentPosition: user?.currentPosition || '',
      company: user?.company || '',
      linkedinProfile: user?.linkedinProfile || ''
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-10 w-10" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                <p className="text-blue-100 capitalize">{user?.role}</p>
                {user?.role === 'alumni' && user?.graduationYear && (
                  <p className="text-blue-200 text-sm">Class of {user.graduationYear}</p>
                )}
                <p className="text-blue-200 text-sm">{user?.major}</p>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition duration-200"
              >
                <PencilIcon className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 2, message: "Name must be at least 2 characters" }
                    })}
                    type="text"
                    className="input"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    {...register("experience")}
                    className="input"
                  >
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  {...register("bio", {
                    maxLength: { value: 500, message: "Bio cannot exceed 500 characters" }
                  })}
                  rows={4}
                  className="input"
                  placeholder="Tell us about yourself, your interests, and career goals..."
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <input
                  {...register("skills")}
                  type="text"
                  className="input"
                  placeholder="JavaScript, React, Node.js, Python (comma-separated)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Separate skills with commas
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Position
                  </label>
                  <input
                    {...register("currentPosition")}
                    type="text"
                    className="input"
                    placeholder="e.g. Software Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    {...register("company")}
                    type="text"
                    className="input"
                    placeholder="e.g. Tech Corp Inc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn Profile
                </label>
                <input
                  {...register("linkedinProfile", {
                    pattern: {
                      value: /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
                      message: "Please enter a valid LinkedIn profile URL"
                    }
                  })}
                  type="url"
                  className="input"
                  placeholder="https://www.linkedin.com/in/your-profile"
                />
                {errors.linkedinProfile && (
                  <p className="mt-1 text-sm text-red-600">{errors.linkedinProfile.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary px-6 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Bio Section */}
              <section>
                <h2 className="text-xl font-semibold mb-3">About</h2>
                <p className="text-gray-700">
                  {user?.bio || 'No bio provided yet.'}
                </p>
              </section>

              {/* Professional Info */}
              <section>
                <h2 className="text-xl font-semibold mb-3">Professional Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-700">Experience Level</h3>
                    <p className="text-gray-600">{user?.experience || 'Not specified'}</p>
                  </div>

                  {user?.currentPosition && (
                    <div>
                      <h3 className="font-medium text-gray-700">Current Position</h3>
                      <p className="text-gray-600">{user.currentPosition}</p>
                    </div>
                  )}

                  {user?.company && (
                    <div>
                      <h3 className="font-medium text-gray-700">Company</h3>
                      <p className="text-gray-600">{user.company}</p>
                    </div>
                  )}

                  {user?.linkedinProfile && (
                    <div>
                      <h3 className="font-medium text-gray-700">LinkedIn</h3>
                      <a 
                        href={user.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        View Profile
                      </a>
                    </div>
                  )}
                </div>
              </section>

              {/* Skills */}
              {user?.skills && user.skills.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-3">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Account Info */}
              <section>
                <h2 className="text-xl font-semibold mb-3">Account Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-700">Email</h3>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Member Since</h3>
                    <p className="text-gray-600">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
