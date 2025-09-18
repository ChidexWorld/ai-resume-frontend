import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Building,
  Briefcase,
  Loader2,
  Globe,
} from "lucide-react";
import { useRegister } from "../../hooks/useAuth";

const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  phone: yup
    .string()
    .matches(/^[0-9+\-\s()]+$/, "Invalid phone number format")
    .optional(),
  user_type: yup
    .string()
    .oneOf(["employee", "employer"] as const)
    .required("User type is required"),
  company_name: yup.string().when("user_type", {
    is: "employer",
    then: (schema) => schema.required("Company name is required"),
    otherwise: (schema) => schema.optional(),
  }),
  company_website: yup
    .string()
    .url("Invalid website URL")
    .when("user_type", {
      is: "employer",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.optional(),
    }),
  company_size: yup.string().when("user_type", {
    is: "employer",
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.optional(),
  }),
  terms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions"),
});

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  user_type: "employee" | "employer";
  company_name?: string;
  company_website?: string;
  company_size?: string;
  terms: boolean;
}

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      user_type: "employee",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      company_name: "",
      company_website: "",
      company_size: "",
      terms: false,
    },
  });

  const selectedUserType = watch("user_type");

  const onSubmit = (data: FormData) => {
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      user_type: data.user_type,
      ...(data.phone && { phone: data.phone }),
      ...(data.company_name && { company_name: data.company_name }),
      ...(data.company_website && { company_website: data.company_website }),
      ...(data.company_size && { company_size: data.company_size }),
    };

    registerMutation.mutate(payload);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="gradient-bg p-8 text-white">
          <h2 className="text-3xl font-bold text-center">Create Account</h2>
          <p className="text-center mt-2 text-primary-100">
            Join our AI-powered recruitment platform
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* User Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              I want to
            </label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setValue("user_type", "employee")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedUserType === "employee"
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <User className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">Find a Job</span>
                <p className="text-xs mt-1 text-gray-500">
                  I'm looking for work opportunities
                </p>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setValue("user_type", "employer")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedUserType === "employer"
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Briefcase className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">Hire Talent</span>
                <p className="text-xs mt-1 text-gray-500">
                  I'm looking to hire employees
                </p>
              </motion.button>
            </div>
            <input type="hidden" {...register("user_type")} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* First Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register("first_name")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="John"
                />
              </div>
              {errors.first_name && (
                <p className="text-red-500 text-sm">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            {/* Last Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register("last_name")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="Doe"
                />
              </div>
              {errors.last_name && (
                <p className="text-red-500 text-sm">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Field (Optional) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Phone (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  {...register("phone")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Employer-specific fields */}
          {selectedUserType === "employer" && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Company Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Company Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      {...register("company_name")}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Acme Corporation"
                    />
                  </div>
                  {errors.company_name && (
                    <p className="text-red-500 text-sm">
                      {errors.company_name.message}
                    </p>
                  )}
                </div>

                {/* Company Size Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Company Size (Optional)
                  </label>
                  <select
                    {...register("company_size")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                  {errors.company_size && (
                    <p className="text-red-500 text-sm">
                      {errors.company_size.message}
                    </p>
                  )}
                </div>

                {/* Company Website Field */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Company Website (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      {...register("company_website")}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="https://www.company.com"
                    />
                  </div>
                  {errors.company_website && (
                    <p className="text-red-500 text-sm">
                      {errors.company_website.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="space-y-2">
            <label className="flex items-start">
              <input
                type="checkbox"
                {...register("terms")}
                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 mt-1"
              />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-sm">{errors.terms.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={registerMutation.isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </motion.button>

          {/* Sign In Link */}
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </motion.div>
  );
};
