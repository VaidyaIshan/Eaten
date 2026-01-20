import { useState } from "react"
import { useAuth } from "@/src/hooks/useAuth"

interface SeededUser {
  id: string
  username: string
  email: string
  role_id: number
  is_active: boolean
}

interface FailedUser {
  row: number
  username: string
  error: string
}

interface SeederResponse {
  total_rows: number
  created_users: number
  failed_users: number
  created_users_list: SeededUser[]
  failed_users_list: FailedUser[]
  message: string
}

export default function UserSeederSection() {
  const { getToken } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SeederResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]

      // Validate file type
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ]

      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload a valid Excel file (.xlsx or .xls)")
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file")
      return
    }

    const token = getToken()
    if (!token) {
      setError("Authentication token not found")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("http://localhost:8000/Eaten/auth/seed-users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (res.ok) {
        const data: SeederResponse = await res.json()
        setResult(data)
        setShowResults(true)
        setFile(null)
        // Reset file input
        const fileInput = document.getElementById("excelFile") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        const errorData = await res.json()
        setError(errorData.detail || "Failed to seed users")
      }
    } catch (err) {
      console.error(err)
      setError("Failed to seed users. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    // Create a simple CSV template
    const templateContent = `username,email,password,role_id,is_active
user1,user1@example.com,password123,2,true
user2,user2@example.com,password456,2,false`

    const element = document.createElement("a")
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(templateContent)
    )
    element.setAttribute("download", "user_seeder_template.csv")
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900">
        Seed Users from Excel
      </h2>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>
            Upload an Excel file (.xlsx or .xls) with user data
          </li>
          <li>
            Required columns: <code className="bg-blue-100 px-1 rounded">username</code>,{" "}
            <code className="bg-blue-100 px-1 rounded">email</code>,{" "}
            <code className="bg-blue-100 px-1 rounded">password</code>
          </li>
          <li>
            Optional columns: <code className="bg-blue-100 px-1 rounded">role_id</code> (default: 2),{" "}
            <code className="bg-blue-100 px-1 rounded">is_active</code> (default: false)
          </li>
          <li>Role IDs: 0 = Superadmin, 1 = Admin, 2 = User</li>
        </ul>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-2 block">
                Select Excel File
              </span>
              <input
                id="excelFile"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </label>

            {file && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                <span>✓</span>
                <span>{file.name}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Uploading..." : "Upload & Seed Users"}
            </button>

            <button
              onClick={downloadTemplate}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Download Template
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {showResults && result && (
        <div className="space-y-4">
          {/* Summary Box */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
            <p className="text-sm font-medium text-purple-900 mb-2">{result.message}</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{result.created_users}</p>
                <p className="text-xs text-purple-700">Created</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{result.failed_users}</p>
                <p className="text-xs text-purple-700">Failed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">{result.total_rows}</p>
                <p className="text-xs text-purple-700">Total</p>
              </div>
            </div>
          </div>

          {/* Created Users */}
          {result.created_users_list.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-3">
                ✓ Successfully Created Users ({result.created_users})
              </h3>
              <div className="space-y-2">
                {result.created_users_list.map((user, idx) => (
                  <div
                    key={idx}
                    className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm"
                  >
                    <p className="font-medium text-green-900">
                      {user.username}
                    </p>
                    <p className="text-green-700">{user.email}</p>
                    <div className="flex gap-2 mt-1 text-xs">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        Role: {user.role_id === 0 ? "Superadmin" : user.role_id === 1 ? "Admin" : "User"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded ${
                          user.is_active
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Failed Users */}
          {result.failed_users_list.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-red-700 mb-3">
                ✗ Failed Users ({result.failed_users})
              </h3>
              <div className="space-y-2">
                {result.failed_users_list.map((user, idx) => (
                  <div
                    key={idx}
                    className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm"
                  >
                    <p className="font-medium text-red-900">
                      Row {user.row}: {user.username || "(empty)"}
                    </p>
                    <p className="text-red-700">{user.error}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close Results Button */}
          <button
            onClick={() => {
              setShowResults(false)
              setResult(null)
            }}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Close Results
          </button>
        </div>
      )}
    </div>
  )
}
