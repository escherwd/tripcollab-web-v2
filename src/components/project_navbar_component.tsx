import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { MapProject } from "./global_map";
import { RiLoaderFill } from "@remixicon/react";
import { ProjectFunctionUpdateProject } from "@/app/(layout-map)/t/[slug]/content";

export default function ProjectNavbarComponent({
  project,
  serverOperationsInProgress,
  updateProject,
}: {
  project: MapProject;
  serverOperationsInProgress: number;
  updateProject: ProjectFunctionUpdateProject;
}) {
  const [projectName, setProjectName] = useState(project.name);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const nameChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
    // Update the UI/Server
    const newName = event.target.value;
    updateProject((p) => ({ ...p, name: newName }));
    setProjectName(newName);
  };

  const nameBlurEvent = (event: FocusEvent<HTMLInputElement>) => {
    // Reset the name if they clear the input
    if (event.target.value.trim() === "") {
      const newName = "Untitled Trip";
      updateProject((p) => ({ ...p, name: newName }));
      setProjectName(newName);
    }
  };

  useEffect(() => {
    if (nameInputRef.current)
      nameInputRef.current.size = projectName.length || 1;
  }, [projectName, nameInputRef]);

  return (
    <div className="flex gap-2 justify-between items-center -ml-1">
      <span className="font-mono text-sm font-medium text-gray-400">/</span>

      <input
        ref={nameInputRef}
        value={projectName}
        onChange={nameChangeEvent}
        onBlur={nameBlurEvent}
        onKeyDown={(e) => (e.key === 'Enter') ? e.currentTarget.blur() : null}
        className="text-gray-700 -mx-1 hover:bg-gray-100 focus:bg-gray-100 px-4 py-2 rounded-lg transition-colors min-w-32 max-w-128"
      />

      <div className="flex-1"></div>
      <div
        className={`mr-2 shrink min-w-0 flex gap-2 items-center text-gray-400 transition-opacity ${
          serverOperationsInProgress > 0 ? "opacity-100" : "opacity-0"
        }`}
      >
        <RiLoaderFill className="animate-spin size-4" />
        <div className="text-sm">Saving</div>
      </div>
      <div className="tc-nav-button tc-nav-button-primary">Share</div>
    </div>
  );
}
