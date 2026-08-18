import { FONTS, STYLE_LABELS, type FontStyle } from '../lib/fonts'
import { THEMES } from '../lib/themes'
import { FORMAT_BY_ID, SCALES } from '../lib/formats'
import FormatPicker from './FormatPicker'
import { Dim } from './Wordmark'
import {
  LAYOUT_LABELS,
  ORNAMENT_LABELS,
  toFa,
  type Layout,
  type Ornament,
  type PoemState,
} from '../lib/poem'
import { Button, Chips, Field, Section, Slider, TextArea, TextInput, Toggle } from './ui'

type Patch = (p: Partial<PoemState>) => void

const STYLE_ORDER: FontStyle[] = ['nastaliq', 'naskh', 'sans', 'display']

export default function Controls({
  state,
  patch,
  onBrowse,
  onAutoFit,
  scale,
  setScale,
}: {
  state: PoemState
  patch: Patch
  scale: number
  setScale: (s: number) => void
  onBrowse: () => void
  onAutoFit: () => void
}) {
  const fmt = FORMAT_BY_ID.get(state.formatId)!
  return (
    <div className="flex flex-col gap-3">
      <Section title="متن" hint="خط خالی = بند تازه" delay={0}>
        <div className="flex flex-col gap-3">
          <Button onClick={onBrowse}>
            <span className="h-[6px] w-[6px] rounded-full bg-gold" aria-hidden />
            انتخاب از گنجور
          </Button>

          <TextArea
            rows={9}
            value={state.text}
            placeholder={'شعر یا نثر خود را اینجا بنویسید یا بچسبانید…'}
            onChange={(e) => patch({ text: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-2">
            <Field label="عنوان">
              <TextInput value={state.title} onChange={(e) => patch({ title: e.target.value })} />

            </Field>

            <Field label="شاعر">
              <TextInput value={state.poet} onChange={(e) => patch({ poet: e.target.value })} />

            </Field>

          </div>

          <Field label="مأخذ">
            <TextInput
              value={state.source}
              placeholder="دیوان، دفتر، غزل…"
              onChange={(e) => patch({ source: e.target.value })}
            />

          </Field>

        </div>

      </Section>

      <Section title="قلم" hint={`${toFa(FONTS.length)} قلم`} delay={40}>
        <div className="flex flex-col gap-3">
          {STYLE_ORDER.map((style) => {
            const group = FONTS.filter((f) => f.style === style)
            if (!group.length) return null
            return (
              <div key={style}>
                <div className="mb-1.5 text-[11px] text-ink-2/70 dark:text-night-ink-2">
                  {STYLE_LABELS[style]}
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {group.map((f) => {
                    const active = f.id === state.fontId
                    return (
                      <button
                        key={f.id}
                        type="button"
                        title={`${f.family} — ${f.license}`}
                        onClick={() => patch({ fontId: f.id })}
                        className={`rounded-xl border px-2 py-2.5 text-[13px] transition ${
                          active
                            ? 'border-tan bg-tan/15 text-ink dark:text-night-ink'
                            : 'border-line/60 text-ink-2 hover:border-tan/60 hover:bg-tan/5 dark:border-night-line dark:text-night-ink-2'
                        }`}
                        style={{
                          fontFamily: `"${f.family}", Vazirmatn, Tahoma, sans-serif`,
                          fontSize: 13 * (f.sizeAdjust ?? 1),
                        }}
                      >
                        {f.label}
                      </button>

                    )
                  })}
                </div>

              </div>

            )
          })}
        </div>

      </Section>

      <Section title="رنگ و کاغذ" delay={80}>
        <div className="grid grid-cols-4 gap-2">
          {THEMES.map((t) => {
            const active = t.id === state.themeId
            return (
              <button
                key={t.id}
                type="button"
                title={t.label}
                onClick={() => patch({ themeId: t.id })}
                className={`overflow-hidden rounded-xl border transition ${
                  active ? 'border-tan ring-2 ring-tan/30' : 'border-line/60 dark:border-night-line'
                }`}
              >
                <span className="block h-11 w-full" style={{ background: t.bg }}>
                  <span
                    className="mx-auto mt-4 block h-px w-1/2"
                    style={{ background: t.accent, opacity: 0.8 }}
                  />

                </span>

                <span className="block py-1 text-[10.5px] text-ink-2 dark:text-night-ink-2">
                  {t.label}
                </span>

              </button>

            )
          })}
        </div>

      </Section>

      <Section title="اندازه خروجی" hint={<Dim w={fmt.w} h={fmt.h} />} delay={120}>

        <div className="flex flex-col gap-4">
          <FormatPicker value={state.formatId} onChange={(formatId) => patch({ formatId })} />

          <Field
            label={
              <>
                کیفیت — <Dim w={fmt.w * scale} h={fmt.h * scale} /> پیکسل

              </>
            }
          >
            <Chips
              options={SCALES.map((s) => ({ id: s.id as number, label: s.label }))}
              value={scale}
              onChange={setScale}
            />

          </Field>

        </div>

      </Section>

      <Section title="چیدمان" delay={160}>
        <div className="flex flex-col gap-3">
          <Field label="نوع شعر">
            <Chips
              options={(Object.keys(LAYOUT_LABELS) as Layout[]).map((l) => ({
                id: l,
                label: LAYOUT_LABELS[l],
              }))}
              value={state.layout}
              onChange={(layout) => patch({ layout })}
            />

          </Field>

          <Field label="تزئین">
            <Chips
              columns={3}
              options={(Object.keys(ORNAMENT_LABELS) as Ornament[]).map((o) => ({
                id: o,
                label: ORNAMENT_LABELS[o],
              }))}
              value={state.ornament}
              onChange={(ornament) => patch({ ornament })}
            />

          </Field>

          {state.layout !== 'beit' && (
            <Field label="تراز">
              <Chips
                options={[
                  { id: 'center' as const, label: 'وسط' },
                  { id: 'justify' as const, label: 'هم‌تراز' },
                  { id: 'start' as const, label: 'راست' },
                ]}
                value={state.align}
                onChange={(align) => patch({ align })}
              />

            </Field>

          )}
        </div>

      </Section>

      <Section title="حروف‌چینی" delay={200}>
        <div className="flex flex-col gap-3.5">
          <div>
            <Slider
              label="اندازه قلم"
              min={16}
              max={110}
              value={state.fontSize}
              onChange={(fontSize) => patch({ fontSize })}
              format={(v) => toFa(v)}
            />

            <button
              type="button"
              onClick={onAutoFit}
              className="mt-1 text-[11px] text-tan hover:underline"
            >
              اندازهٔ خودکار
            </button>

          </div>

          <Slider
            label="فاصله سطرها"
            min={1.2}
            max={3.4}
            step={0.05}
            value={state.lineHeight}
            onChange={(lineHeight) => patch({ lineHeight })}
            format={(v) => toFa(v.toFixed(2))}
          />

          <Slider
            label="فاصله بیت‌ها"
            min={0}
            max={2.4}
            step={0.05}
            value={state.beitGap}
            onChange={(beitGap) => patch({ beitGap })}
            format={(v) => toFa(v.toFixed(2))}
          />

          <Slider
            label="فاصله حروف"
            min={-2}
            max={8}
            step={0.25}
            value={state.letterSpacing}
            onChange={(letterSpacing) => patch({ letterSpacing })}
            format={(v) => toFa(v.toFixed(2))}
          />

          <Slider
            label="حاشیه"
            min={30}
            max={260}
            value={state.padding}
            onChange={(padding) => patch({ padding })}
            format={(v) => toFa(v)}
          />

          <Toggle
            label="نشان The Booklet"
            checked={state.watermark}
            onChange={(watermark) => patch({ watermark })}
          />

          <Toggle
            label="ارقام فارسی (۱۲۳)"
            checked={state.persianDigits}
            onChange={(persianDigits) => patch({ persianDigits })}
          />

          <Toggle
            label="شماره صفحه"
            checked={state.showPageNumber}
            onChange={(showPageNumber) => patch({ showPageNumber })}
          />

          {state.showPageNumber && (
            <Slider
              label="شماره"
              min={1}
              max={999}
              value={state.pageNumber}
              onChange={(pageNumber) => patch({ pageNumber })}
              format={(v) => toFa(v)}
            />

          )}
        </div>

      </Section>

    </div>

  )
}
