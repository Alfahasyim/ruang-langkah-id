import Image from "next/image";
import { Zoomable } from "@/components/ui/Zoomable";
import { initialsOf, teamPhotoUrl, TEAM_TONES, type TeamMember } from "@/lib/team";

export function TeamCard({
  member,
  index = 0,
}: {
  member: TeamMember;
  index?: number;
}) {
  const photoUrl = teamPhotoUrl(member.photo_path);
  const tone = TEAM_TONES[index % TEAM_TONES.length];

  return (
    <article className="rounded-3xl border border-sand-200 bg-white p-7">
      {photoUrl ? (
        <Zoomable
          src={photoUrl}
          alt={member.full_name}
          className="h-14 w-14 overflow-hidden rounded-2xl"
        >
          <Image
            src={photoUrl}
            alt={member.full_name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </Zoomable>
      ) : (
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-2xl font-display text-lg font-semibold text-white ${tone}`}
        >
          {initialsOf(member.full_name)}
        </span>
      )}

      <h3 className="mt-5 text-lg font-semibold text-forest-950">
        {member.full_name}
      </h3>
      <p className="mt-1 text-sm font-medium text-terracotta-600">{member.role}</p>
      <p className="mt-3 text-sm leading-relaxed text-granite-600">{member.bio}</p>
    </article>
  );
}
