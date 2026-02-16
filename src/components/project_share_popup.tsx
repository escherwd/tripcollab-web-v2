import { AppUser, ProjectUser } from "@/backend/auth/get_user";
import { MapProject } from "./global_map";
import PopupWindow from "./popup_window";
import UserAvatars from "./user_avatars";
import {
  MdDelete,
  MdGroupOff,
  MdInfo,
  MdInfoOutline,
  MdLink,
  MdLinkOff,
  MdPublic,
  MdPublicOff,
  MdRemove,
} from "react-icons/md";
import {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { serverSearchUsers } from "@/app/api/users/search_users";
import { debounce } from "lodash";
import { useDebounce, useThrottle } from "@/app/utils/ui/debounce";
import {
  ProjectFunctionUpdateProject,
  userCanEdit,
} from "@/app/(layout-map)/t/[slug]/content";
import PanelIconButton from "./panel_icon_button";
import { serverUpdateProjectUsers } from "@/app/api/project/update_users";

function ProjectShareUserRow({
  user,
  canEdit,
  onDelete,
  onAccessChange,
  isCurrentUser = false,
}: {
  user: ProjectUser;
  canEdit: boolean;
  isCurrentUser?: boolean;
  onDelete?: () => void;
  onAccessChange?: (canEdit: boolean) => void;
}) {
  return (
    <div className="py-2 px-4 flex gap-4 items-center">
      <div className="size-10">
        <UserAvatars users={[user]} />
      </div>
      <div className="flex-1">
        <div className="flex gap-1.5 items-center">
          {user.firstName}
          {isCurrentUser && (
            <div className="px-2 py-0.5 bg-purple-100 font-medium text-purple-400 text-xs rounded">
              You
            </div>
          )}
        </div>
        <div className="text-sm text-gray-500">@{user.username}</div>
      </div>
      {onAccessChange && (
        <div>
          <select
            value={canEdit ? "yes" : "no"}
            onChange={(e) => onAccessChange(e.target.value == "yes")}
            className="text-sm"
            name="can_edit"
            disabled={isCurrentUser || !userCanEdit}
          >
            <option value={"yes"}>Can Edit</option>
            <option value={"no"}>Can View</option>
          </select>
        </div>
      )}
      {onDelete && !isCurrentUser && userCanEdit && (
        <div>
          <PanelIconButton
            className="bg-red-100 hover:bg-red-200"
            onClick={onDelete}
            icon={<MdRemove className="text-red-500" />}
          />
        </div>
      )}
    </div>
  );
}

export default function ProjectSharePopup({
  project,
  onClose,
  updateProject,
  currentUser,
}: {
  project: MapProject;
  onClose?: () => void;
  updateProject: ProjectFunctionUpdateProject;
  currentUser?: AppUser;
}) {
  const [userAddQuery, setUserAddQuery] = useState("");
  const [userAddSearchResults, setUserAddSearchResults] = useState<
    ProjectUser[] | null
  >(null);

  const [sessionProjectShares, setSessionProjectShares] = useState<
    (Omit<MapProject["projectShares"][number], "id"> & {
      id?: string;
    })[]
  >(project.projectShares);

  const [isPublic, setIsPublic] = useState(project.public);

  useEffect(() => {
    setSessionProjectShares(project.projectShares);
    setIsPublic(project.public);
  }, [project]);

  useEffect(() => {
    console.log("rendering with ", sessionProjectShares, project);
  }, []);

  const debouncedUserSearch = useThrottle(async (query: string) => {
    try {
      const results = await serverSearchUsers(
        query,
        [project.user.id].concat(sessionProjectShares.map((u) => u.userId)),
      );
      setUserAddSearchResults(results);
    } catch (err) {
      console.log(err);
    }
  }, 500);

  const onUserQueryInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setUserAddQuery(query);

    if (query.length < 2) {
      setUserAddSearchResults(null);
      return;
    }

    debouncedUserSearch(query);
  };

  const addUser = (user: ProjectUser) => {
    if (project.userId == user.id) return;
    if (sessionProjectShares.find((ps) => ps.userId == user.id)) return;

    setUserAddQuery("");
    setUserAddSearchResults(null);

    sessionProjectShares.push({
      userId: user.id,
      user,
      projectId: project.id,
      canEdit: false,
    });
  };

  const removeUser = (user: ProjectUser) => {
    setSessionProjectShares((old) => old.filter((ps) => ps.userId != user.id));
  };

  const updateUserAccess = (user: ProjectUser, canEdit: boolean) => {
    setSessionProjectShares((old) =>
      old.map((ps) => {
        if (ps.userId == user.id) {
          return {
            ...ps,
            canEdit: canEdit,
          };
        } else {
          return ps;
        }
      }),
    );
  };

  const onCopyUrlClick = (event: MouseEvent<HTMLAnchorElement>) => {
    navigator.clipboard.writeText(`https://tripcollab.app/t/${project.slug}`);
    const target = event.currentTarget;
    target.innerText = "copied";
    setTimeout(() => {
      target.innerText = "copy";
    }, 2000);
  };

  const [isLoading, setIsLoading] = useState(false);

  const saveChanges = async () => {
    setIsLoading(true);

    try {
      const projectShares = await serverUpdateProjectUsers(
        project.id,
        sessionProjectShares.map((ps) => ({
          id: ps.userId,
          canEdit: ps.canEdit,
        })),
      );
      console.log(projectShares);
      updateProject((p) => ({
        ...p,
        public: isPublic,
        projectShares: projectShares,
      }));
      onClose?.();
    } catch (err) {
      alert(err);
    }

    setIsLoading(false);
  };

  return (
    <PopupWindow title="Sharing" onClose={() => onClose?.()}>
      <div className="p-4 flex-1 overflow-scroll min-h-[400px]">
        <div className="pt-0">
          <div className="tc-small-heading">Owner</div>
          <div className="rounded-lg bg-gray-50">
            <ProjectShareUserRow
              user={project.user}
              canEdit
              isCurrentUser={project.user.id == currentUser?.id}
            />
          </div>
        </div>
        <div className="pt-8">
          <div className="tc-small-heading">Visibility</div>
          <div
            className={`${isPublic ? "rounded-t-lg" : "rounded-lg"} flex items-center p-4 gap-4 bg-gray-50`}
          >
            <div>
              {isPublic ? (
                <MdLink className="size-5" />
              ) : (
                <MdLinkOff className="size-5" />
              )}
            </div>
            <div>
              <select
                defaultValue={isPublic ? "yes" : "no"}
                onChange={(e) => setIsPublic(e.target.value == "yes")}
                disabled={!userCanEdit}
              >
                <option value="no">Private</option>
                <option value="yes">Public</option>
              </select>
            </div>
            <div className="flex-1 text-right text-sm">
              {isPublic ? (
                <span>Anyone with a link can view this trip</span>
              ) : (
                <span>Only users you add can access this trip</span>
              )}
            </div>
          </div>
          {isPublic && (
            <div className="py-2 px-4 text-sm flex gap-2 bg-green-50 text-green-600 rounded-b-lg">
              <div className="flex-1">
                Published at{" "}
                <span className="font-semibold">
                  tripcollab.app/t/{project.slug}
                </span>
              </div>
              <a
                className="hover:underline cursor-pointer"
                onClick={onCopyUrlClick}
              >
                copy
              </a>
            </div>
          )}
        </div>
        <div className="pt-8 mb-8">
          <div className="tc-small-heading">Users With Access</div>

          {userCanEdit && (
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                placeholder="Add users by name, username, or email"
                className="tc-input border-2 !bg-gray-50 border-gray-100 rounded-lg flex-1"
                value={userAddQuery}
                onChange={onUserQueryInputChange}
              />
            </div>
          )}

          <div className="relative w-full">
            {userAddSearchResults && (
              <div className="absolute w-full z-20 top-0 left-0 right-0 h-42 bg-white divide-y divide-gray-100 rounded-lg shadow-lg overflow-scroll">
                {userAddSearchResults.length > 0 ? (
                  userAddSearchResults.map((user) => (
                    <button
                      key={user.id}
                      className="hover:bg-gray-100 transition-colors block w-full text-left cursor-pointer"
                      onClick={() => addUser(user)}
                    >
                      <ProjectShareUserRow user={user} canEdit />
                    </button>
                  ))
                ) : (
                  <div className="flex size-full items-center justify-center text-gray-400">
                    No Results
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-lg flex flex-col bg-gray-50 divide-y min-h-32 divide-gray-100 ">
            {sessionProjectShares.length > 0 ? (
              sessionProjectShares.map((ps) => (
                <ProjectShareUserRow
                  key={ps.id ?? `${ps.userId}-${ps.projectId}`}
                  user={ps.user}
                  canEdit={ps.canEdit}
                  onAccessChange={(v) => updateUserAccess(ps.user, v)}
                  onDelete={() => removeUser(ps.user)}
                  isCurrentUser={ps.userId == currentUser?.id}
                />
              ))
            ) : (
              <div className="text-center flex gap-1 flex-1 flex-col h-full items-center justify-center p-6 text-gray-400">
                <MdGroupOff className="size-6" />
                <span>No Users</span>
              </div>
            )}
          </div>

          {userCanEdit && (
            <div
              className={`flex gap-1 mt-3 items-center text-sm text-gray-400 transition-opacity ${sessionProjectShares.length > 0 ? "opacity-100" : "opacity-0"}`}
            >
              <MdInfoOutline />

              <span>
                Users with edit access
                can manage these users
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-0 border-t border-gray-100 p-4 gap-2 flex items-center justify-end">
        <button onClick={() => onClose?.()} className="tc-button">
          Cancel
        </button>
        <button
          disabled={isLoading}
          onClick={() => saveChanges()}
          className={`tc-button tc-button-primary ${isLoading && "!cursor-wait"}`}
        >
          Update
        </button>
      </div>
    </PopupWindow>
  );
}
