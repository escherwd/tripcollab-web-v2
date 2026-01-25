import { ProjectUser } from "@/backend/auth/get_user";
import { MdFace, MdPerson } from "react-icons/md";

export default function UserAvatars({
  users,
  overlap = 10,
}: {
  users: ProjectUser[];
  overlap?: number;
}) {
  return (
    <div className="whitespace-nowrap h-full relative">
      {users.toReversed().map((user) => {
        return (
          <div
            key={user.id}
            className="h-full aspect-square inline-block last:!mr-0 border-2 border-white rounded-full overflow-hidden"
            style={{
                'marginRight': `-${overlap}px`
            }}
          >
            {user.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt=""
                className="object-cover"
              />
            ) : (
              <div className="size-full bg-gray-800 overflow-hidden rounded-full">
                <MdPerson className="origin-center size-full scale-120 translate-y-1/10 text-gray-500" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
