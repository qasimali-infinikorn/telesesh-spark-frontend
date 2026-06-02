"use client"

import ListManager from "@/components/admin/list-manager"
import { ALL_TAGS } from "@/lib/resources"
import { Tag } from "@/components/admin/shared"

export default function TagsAdminPage() {
  return (
    <ListManager
      title="Tags"
      subtitle="Manage content tags used to categorize resources."
      initialItems={ALL_TAGS}
      icon={<Tag size={16} />}
      placeholder="Add a new tag…"
    />
  )
}
