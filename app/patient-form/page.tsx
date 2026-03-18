"use client";

import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema, PatientFormData } from "@/lib/validations";
import { usePatientSocket } from "@/hooks/useSocket";
import { FormField } from "@/components/FormField";

function genSessionId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function PatientFormPage() {
  const sessionId = useMemo(() => genSessionId(), []);
  const { connected, emitUpdate, emitSubmit } = usePatientSocket(sessionId);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: { gender: undefined, preferredLanguage: "", nationality: "" },
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const formValues = watch();

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      emitUpdate(formValues, "filling");
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [JSON.stringify(formValues)]); 

  const onSubmit = (data: PatientFormData) => {
    emitSubmit(data);
  };

  if (isSubmitSuccessful) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
          <p className="text-gray-500">Your information has been submitted successfully. A staff member will attend to you shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Information</h1>
          <p className="text-gray-500 mt-1">Please fill in your details below</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <span className={`h-2 w-2 rounded-full ${connected ? "bg-green-400" : "bg-gray-300"}`} />
            {connected ? "Live sync active" : "Connecting…"}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <section className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="First Name" required error={errors.firstName}
                {...register("firstName")} placeholder="e.g. John" />
              <FormField label="Middle Name" error={errors.middleName}
                {...register("middleName")} placeholder="Optional" />
              <FormField label="Last Name" required error={errors.lastName}
                {...register("lastName")} placeholder="e.g. Doe" />
              <FormField label="Date of Birth" required type="date" error={errors.dateOfBirth}
                {...register("dateOfBirth")} />
              <FormField as="select" label="Gender" required error={errors.gender}
                {...register("gender")}
                options={[
                  { value: "", label: "Select gender…" },
                  { value: "M", label: "Male" },
                  { value: "F", label: "Female" },
                ]} />
              <FormField label="Nationality" required error={errors.nationality}
                {...register("nationality")} placeholder="e.g. Thai" />
            </div>
          </section>

          <section className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Phone Number" required type="tel" error={errors.phoneNumber}
                {...register("phoneNumber")} placeholder="+66 81 234 5678" />
              <FormField label="Email" type="email" error={errors.email}
                {...register("email")} placeholder="Optional" />
              <div className="sm:col-span-2">
                <FormField label="Address" required error={errors.address}
                  {...register("address")} placeholder="House no., Street, City" />
              </div>
              <FormField as="select" label="Preferred Language" required error={errors.preferredLanguage}
                {...register("preferredLanguage")}
                options={[
                  { value: "", label: "Select language…" },
                  { value: "th", label: "Thai" },
                  { value: "en", label: "English" },
                  { value: "zh", label: "Chinese" },
                  { value: "ja", label: "Japanese" },
                  { value: "other", label: "Other" },
                ]} />
            </div>
          </section>

          <section className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Optional Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Emergency Contact Name" error={errors.emergencyContactName}
                {...register("emergencyContactName")} placeholder="Full name" />
              <FormField label="Relationship" error={errors.emergencyContactRelationship}
                {...register("emergencyContactRelationship")} placeholder="e.g. Spouse, Parent" />
              <FormField label="Religion" error={errors.religion}
                {...register("religion")} placeholder="Optional" />
            </div>
          </section>

          <button type="submit" className="btn-primary w-full py-3 text-base" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Submit Information"}
          </button>
        </form>
      </div>
    </div>
  );
}
