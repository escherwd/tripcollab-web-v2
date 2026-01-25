"use client";

import { serverCreateNewProject } from "@/app/api/project/new_project";
import { RiLoaderFill } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdAdd } from "react-icons/md";

export default function NewProjectButton() {

    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)

    const createNewProject = async () => {

        setIsLoading(true)

        try {
            const project = await serverCreateNewProject();
            router.push(`/t/${project.slug}`)
        } catch (err) {
            alert(`Failed to create project. ${err}`)
            setIsLoading(false)
        }
    }

  return (
    <button onClick={createNewProject} className="bg-white/15 cursor-pointer hover:bg-white/30 transition-colors flex items-center justify-center rounded min-h-32 backdrop-blur-xl">
      {
        isLoading ?  <RiLoaderFill className="text-white/60 animate-spin size-5" /> : <MdAdd className="text-white/60 size-6" />
      }
      
    </button>
  );
}
