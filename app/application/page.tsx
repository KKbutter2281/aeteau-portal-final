import { useState } from "react";
import { useClerk } from "@clerk/clerk-react";

const questions = [
  { label: "Name", name: "name", type: "text", required: true },
  { label: "Email", name: "email", type: "email", required: true },
  { label: "Application Text", name: "applicationText", type: "textarea", required: true },
  { label: "Address", name: "address", type: "text", required: true },
  { label: "Phone Number", name: "phoneNumber", type: "tel", required: true },
  { label: "Date of Birth", name: "dateOfBirth", type: "date", required: true }
];

export default function ApplicationPage() {
  const { user } = useClerk();
  const initialFormData = questions.reduce((acc, question) => {
    acc[question.name] = "";
    return acc;
  }, {});
  
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Assuming you have a function to handle the application submission
      await submitApplication(formData);
      // Update user metadata in Clerk
      await user.update({
        publicMetadata: {
          applied: true,
          applicationData: formData
        }
      });
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">College Application</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div className="mb-4" key={question.name}>
            <label className="block text-sm font-medium text-gray-700">{question.label}</label>
            {question.type === "textarea" ? (
              <textarea
                name={question.name}
                value={formData[question.name]}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                required={question.required}
              />
            ) : (
              <input
                type={question.type}
                name={question.name}
                value={formData[question.name]}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                required={question.required}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}

async function submitApplication(formData: { [key: string]: string }) {
  // Implement your application submission logic here
  // For example, send the data to your backend server
  console.log("Submitting application:", formData);
}