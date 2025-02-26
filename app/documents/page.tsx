import { DocumentUpload } from "@/components/document-upload"

export default function DocumentsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Upload Documents</h1>
      <DocumentUpload />
    </div>
  )
}

