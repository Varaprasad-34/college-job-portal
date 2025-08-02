import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { jobAPI, handleAPIError } from '../utils/api';
import toast from 'react-hot-toast';

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      skills: [''],
      requirements: [''],
      benefits: ['']
    }
  });

  const { 
    fields: skillFields, 
    append: appendSkill, 
    remove: removeSkill 
  } = useFieldArray({
    control,
    name: "skills"
  });

  const { 
    fields: requirementFields, 
    append: appendRequirement, 
    remove: removeRequirement 
  } = useFieldArray({
    control,
    name: "requirements"
  });

  const { 
    fields: benefitFields, 
    append: appendBenefit, 
    remove: removeBenefit 
  } = useFieldArray({
    control,
    name: "benefits"
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Clean up arrays - remove empty entries
      const cleanData = {
        ...data,
        skills: data.skills.filter(skill => skill.trim() !== ''),
        requirements: data.requirements.filter(req => req.trim() !== ''),
        benefits: data.benefits.filter(benefit => benefit.trim() !== ''),
        salaryRange: {
          min: data.salaryMin ? parseInt(data.salaryMin) : undefined,
          max: data.salaryMax ? parseInt(data.salaryMax) : undefined,
          currency: 'USD'
        }
      };

      // Remove individual salary fields
      delete cleanData.salaryMin;
      delete cleanData.salaryMax;

      await jobAPI.createJob(cleanData);
      toast.success('Job posted successfully!');
      navigate('/my-jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error(handleAPIError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
          <p className="text-gray-600">Share a job opportunity with your college community</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  {...register("title", {
                    required: "Job title is required",
                    minLength: { value: 5, message: "Title must be at least 5 characters" }
                  })}
                  type="text"
                  className="input"
                  placeholder="e.g. Software Engineer Intern"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input
                  {...register("company", {
                    required: "Company name is required"
                  })}
                  type="text"
                  className="input"
                  placeholder="e.g. Tech Corp Inc."
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  {...register("location", {
                    required: "Location is required"
                  })}
                  type="text"
                  className="input"
                  placeholder="e.g. New York, NY"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type *
                </label>
                <select
                  {...register("jobType", {
                    required: "Job type is required"
                  })}
                  className="input"
                >
                  <option value="">Select job type</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
                {errors.jobType && (
                  <p className="mt-1 text-sm text-red-600">{errors.jobType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  {...register("experienceLevel")}
                  className="input"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                {...register("description", {
                  required: "Job description is required",
                  minLength: { value: 50, message: "Description must be at least 50 characters" }
                })}
                rows={6}
                className="input"
                placeholder="Provide a detailed description of the job role, responsibilities, and what you're looking for in a candidate..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Salary Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Salary Range (Optional)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Salary ($)
                </label>
                <input
                  {...register("salaryMin", {
                    min: { value: 0, message: "Salary must be positive" }
                  })}
                  type="number"
                  className="input"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Salary ($)
                </label>
                <input
                  {...register("salaryMax", {
                    min: { value: 0, message: "Salary must be positive" }
                  })}
                  type="number"
                  className="input"
                  placeholder="80000"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Required Skills</h2>
            {skillFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <input
                  {...register(`skills.${index}`)}
                  type="text"
                  className="input flex-1"
                  placeholder="e.g. JavaScript, React, Node.js"
                />
                {skillFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendSkill('')}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Skill
            </button>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Requirements</h2>
            {requirementFields.map((field, index) => (
              <div key={field.id} className="flex items-start space-x-2">
                <textarea
                  {...register(`requirements.${index}`)}
                  rows={2}
                  className="input flex-1"
                  placeholder="e.g. Bachelor's degree in Computer Science or related field"
                />
                {requirementFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="p-2 text-red-600 hover:text-red-700 mt-1"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendRequirement('')}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Requirement
            </button>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Benefits (Optional)</h2>
            {benefitFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <input
                  {...register(`benefits.${index}`)}
                  type="text"
                  className="input flex-1"
                  placeholder="e.g. Health insurance, Remote work, Flexible hours"
                />
                {benefitFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendBenefit('')}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Benefit
            </button>
          </div>

          {/* Contact & Application */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Application Details</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email *
                </label>
                <input
                  {...register("contactEmail", {
                    required: "Contact email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  type="email"
                  className="input"
                  placeholder="recruiting@company.com"
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Deadline
                </label>
                <input
                  {...register("applicationDeadline")}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                External Application Link (Optional)
              </label>
              <input
                {...register("applicationLink")}
                type="url"
                className="input"
                placeholder="https://company.com/careers/job-id"
              />
              <p className="mt-1 text-sm text-gray-500">
                If you have an external application form, provide the link here
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="btn btn-secondary px-6 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting Job...
                </div>
              ) : (
                'Post Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobPage;
