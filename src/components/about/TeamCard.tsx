import Image from "next/image";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Zoomable } from "@/components/ui/Zoomable";
import { socialLabel } from "@/lib/social";
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

      {/* whitespace-pre-line: bio diisi admin dan boleh memuat baris baru */}
      <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-granite-600">
        {member.bio}
      </p>

      {member.socials.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {member.socials.map((social) => (
            <li key={social.id}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${member.full_name} di ${socialLabel(social)}`}
                aria-label={`${member.full_name} di ${socialLabel(social)}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-sand-100 text-granite-600 transition-colors hover:bg-forest-700 hover:text-sand-50"
              >
                <SocialIcon platform={social.platform} className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
