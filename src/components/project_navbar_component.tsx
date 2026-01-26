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
import ProjectSharePopup from "./project_share_popup";
import UserAvatars from "./user_avatars";
import { AppUser } from "@/backend/auth/get_user";

export default function ProjectNavbarComponent({
  project,
  serverOperationsInProgress,
  updateProject,
  currentUser,
}: {
  project: MapProject;
  serverOperationsInProgress: number;
  updateProject: ProjectFunctionUpdateProject;
  currentUser?: AppUser,
}) {
  const [projectName, setProjectName] = useState(project.name);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const [sharePopupOpen, setSharePopupOpen] = useState<boolean>(false);

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
    <>
      {sharePopupOpen && (
        <ProjectSharePopup
          onClose={() => setSharePopupOpen(false)}
          project={project}
          updateProject={updateProject}
          currentUser={currentUser}
        />
      )}
      <div className="flex gap-2 justify-between items-center -ml-1">
        <span className="font-mono text-sm font-medium text-gray-400">/</span>

        <input
          ref={nameInputRef}
          value={projectName}
          onChange={nameChangeEvent}
          onBlur={nameBlurEvent}
          onKeyDown={(e) => (e.key === "Enter" ? e.currentTarget.blur() : null)}
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
        <button
          onClick={() => setSharePopupOpen(true)}
          className="tc-nav-button tc-nav-button-primary flex items-center gap-2"
        >
          Share
          {project.projectShares.length > 0 && (
            <div className="h-5">
               <UserAvatars itemClass="border-gray-950! border-1!" users={project.projectShares.map((ps) => ps.user)} />
            </div>
           
          )}
        </button>
      </div>
    </>
  );
}
