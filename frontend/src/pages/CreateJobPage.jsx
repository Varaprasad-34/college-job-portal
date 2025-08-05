import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { jobAPI, handleAPIError } from "../utils/api";
import toast from "react-hot-toast";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      skills: [""],
      requirements: [""],
      benefits: [""],
    },
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({ control, name: "skills" });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({ control, name: "requirements" });

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({ control, name: "benefits" });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const cleanData = {
        ...data,
        skills: data.skills.filter((skill) => skill.trim() !== ""),
        requirements: data.requirements.filter((req) => req.trim() !== ""),
        benefits: data.benefits.filter((benefit) => benefit.trim() !== ""),
        salaryRange: {
          min: data.salaryMin ? parseInt(data.salaryMin) : undefined,
          max: data.salaryMax ? parseInt(data.salaryMax) : undefined,
          currency: "USD",
        },
      };
      delete cleanData.salaryMin;
      delete cleanData.salaryMax;

      await jobAPI.createJob(cleanData);
      toast.success("Job posted successfully!");
      navigate("/my-jobs");
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error(handleAPIError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Post a New Job</h1>
          <p className="text-gray-600 text-sm">Share a job opportunity with your college community</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Job Information</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                label="Job Title *"
                placeholder="e.g. Software Engineer Intern"
                error={errors.title?.message}
                {...register("title", {
                  required: "Job title is required",
                  minLength: {
                    value: 5,
                    message: "Title must be at least 5 characters",
                  },
                })}
              />
              <InputField
                label="Company *"
                placeholder="e.g. Tech Corp Inc."
                error={errors.company?.message}
                {...register("company", {
                  required: "Company name is required",
                })}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <InputField
                label="Location *"
                placeholder="e.g. New York, NY"
                error={errors.location?.message}
                {...register("location", {
                  required: "Location is required",
                })}
              />

              <SelectField
                label="Job Type *"
                error={errors.jobType?.message}
                {...register("jobType", { required: "Job type is required" })}
              >
                <option value="">Select job type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </SelectField>

              <SelectField
                label="Experience Level"
                {...register("experienceLevel")}
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </SelectField>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                {...register("description", {
                  required: "Job description is required",
                  minLength: {
                    value: 50,
                    message: "Description must be at least 50 characters",
                  },
                })}
                rows={6}
                className="input w-full"
                placeholder="Provide a detailed description..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Salary Range (Optional)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                label="Minimum Salary ($)"
                type="number"
                placeholder="50000"
                {...register("salaryMin", {
                  min: { value: 0, message: "Salary must be positive" },
                })}
              />

              <InputField
                label="Maximum Salary ($)"
                type="number"
                placeholder="80000"
                {...register("salaryMax", {
                  min: { value: 0, message: "Salary must be positive" },
                })}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Required Skills</h2>
            {skillFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <InputField
                  placeholder="e.g. JavaScript, React"
                  {...register(`skills.${index}`)}
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
              onClick={() => appendSkill("")}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Skill
            </button>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Requirements</h2>
            {requirementFields.map((field, index) => (
              <div key={field.id} className="flex items-start space-x-2">
                <textarea
                  {...register(`requirements.${index}`)}
                  rows={2}
                  className="input w-full"
                  placeholder="e.g. Bachelor's degree in Computer Science"
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
              onClick={() => appendRequirement("")}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Requirement
            </button>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Benefits (Optional)</h2>
            {benefitFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <InputField
                  placeholder="e.g. Health insurance"
                  {...register(`benefits.${index}`)}
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
              onClick={() => appendBenefit("")}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Benefit
            </button>
          </div>

          {/* Application Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Application Details</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                label="Contact Email *"
                type="email"
                placeholder="recruiting@company.com"
                error={errors.contactEmail?.message}
                {...register("contactEmail", {
                  required: "Contact email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />

              <InputField
                label="Application Deadline"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                {...register("applicationDeadline")}
              />
            </div>

            <InputField
              label="External Application Link (Optional)"
              type="url"
              placeholder="https://company.com/careers/job-id"
              {...register("applicationLink")}
            />
            <p className="mt-1 text-sm text-gray-500">
              If you have an external application form, provide the link here
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/jobs")}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting Job...
                </div>
              ) : (
                "Post Job"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobPage;
