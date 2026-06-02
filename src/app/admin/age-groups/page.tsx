"use client"

import ListManager from "@/components/admin/list-manager"
import { AGE_GROUPS } from "@/lib/resources"
import { Users } from "@/components/admin/shared"

export default function AgeGroupsAdminPage() {
  return (
    <ListManager
      title="Age Groups"
      subtitle="Manage age group categories for resource targeting."
      initialItems={AGE_GROUPS}
      icon={<Users size={16} />}
      placeholder="Add a new age group…"
    />
  )
}
