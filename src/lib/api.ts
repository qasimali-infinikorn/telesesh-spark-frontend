import { auth } from "@/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

type FetchOptions = Omit<RequestInit, "headers"> & { headers?: Record<string, string> }

export async function apiClient(path: string, options: FetchOptions = {}) {
  const session = await auth()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message ?? "API request failed")
  }

  return res.json()
}
