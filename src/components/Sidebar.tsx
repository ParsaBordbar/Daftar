import { Section } from './ui'
import type { ControlSection } from './Controls'

export default function Sidebar({
  sections,
  collapsed,
  onToggle,
}: {
  sections: ControlSection[]
  collapsed: Record<string, boolean>
  onToggle: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {sections.map((sec, i) => (
        <Section
          key={sec.id}
          title={sec.title}
          icon={sec.icon}
          hint={sec.hint}
          delay={i * 40}
          open={!collapsed[sec.id]}
          onToggle={() => onToggle(sec.id)}
        >
          {sec.content}
        </Section>
      ))}
    </div>
  )
}
