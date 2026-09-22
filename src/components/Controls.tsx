import { useState, type ReactNode } from 'react'
import { FONTS, STYLE_LABELS, type FontStyle } from '../lib/fonts'
import { readImage } from '../lib/image'
import { keysOf } from '../lib/shortcuts'
import { THEMES } from '../lib/themes'
import { FORMAT_BY_ID, SCALES } from '../lib/formats'
import FormatPicker from './FormatPicker'
import OrnamentPicker from './OrnamentPicker'
import { Dim } from './Wordmark'
import {
  LAYOUT_LABELS,
  ORNAMENT_LABELS,
  toFa,
  type Layout,
  type PoemState,
} from '../lib/poem'
import { Button, Chips, Field, Slider, TextArea, TextInput, Toggle } from './ui'
import {
  ColumnIcon,
  CuneiformIcon,
  DiceIcon,
  ImageIcon,
  KongrehIcon,
  BotehIcon,
  QuillIcon,
  ScrollIcon,
  TabletIcon,
  WingIcon,
} from './Icons'

type Patch = (p: Partial<PoemState>) => void

const STYLE_ORDER: FontStyle[] = ['nastaliq', 'naskh', 'sans', 'display']

export interface ControlsProps {
  state: PoemState
  patch: Patch
  scale: number
  setScale: (s: number) => void
  onBrowse: () => void
  onRandom: () => void
  onAutoFit: () => void
  busy?: boolean
}

export interface ControlSection {
  id: string
  title: string

  dock: string
  icon: ReactNode
  hint?: ReactNode
  content: ReactNode
}

export function useControlSections({
  state,
  patch,
  onBrowse,
  onRandom,
  onAutoFit,
  scale,
  setScale,
  busy,
}: ControlsProps): ControlSection[] {
  const fmt = FORMAT_BY_ID.get(state.formatId)!
  const [imgError, setImgError] = useState<string | null>(null)

  const pickImage = async (file: File | undefined) => {
    if (!file) return
    setImgError(null)
    try {
      patch({ bgImage: await readImage(file) })
    } catch {
      setImgError('این فایل به‌عنوان تصویر خوانده نشد.')
    }
  }
  const sections: ControlSection[] = [
    {
      id: 'text',
      dock: 'متن',
      title: 'متن',
      icon: <TabletIcon />,
      hint: 'خط خالی = بند تازه',
      content: (
        <>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Button onClick={onBrowse} className="tip" data-tip={keysOf('ganjoor')}>
              <WingIcon className="[--icon-line:#513423] dark:[--icon-line:#e0c98a]" />
              انتخاب از گنجور
            </Button>
            <Button onClick={onRandom} disabled={busy} title="یک شعر تصادفی از گنجور روی صفحه بگذار">
              <DiceIcon className="[--icon-line:#513423] dark:[--icon-line:#e0c98a]" />
              {busy ? '…' : 'شانسی'}
            </Button>
          </div>

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

        </>
      ),
    },
    {
      id: 'font',
      dock: 'قلم',
      title: 'قلم',
      icon: <QuillIcon />,
      hint: `${toFa(FONTS.length)} قلم`,
      content: (
        <>
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

        </>
      ),
    },
    {
      id: 'paper',
      dock: 'کاغذ',
      title: 'رنگ و کاغذ',
      icon: <BotehIcon />,
      content: (
        <>
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

        <div className="mt-3 flex flex-col gap-2.5">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <label
              className="inline-flex min-h-[42px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-line/70 px-3.5 py-2.5 text-[13px] font-medium text-ink transition-[background-color,border-color,transform] duration-200 ease-page hover:-translate-y-px hover:border-tan hover:bg-tan/10 active:translate-y-0 active:scale-[0.98] dark:border-night-line dark:text-night-ink"
              title="تصویر پس‌زمینه — یا فایل را روی صفحه بکشید"
            >
              <ImageIcon className="[--icon-line:#513423] dark:[--icon-line:#e0c98a]" />
              {state.bgImage ? 'تعویض تصویر' : 'تصویر پس‌زمینه'}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  void pickImage(e.target.files?.[0])
                  e.target.value = ''
                }}
              />
            </label>
            {state.bgImage && (
              <Button onClick={() => patch({ bgImage: '' })} title="حذف تصویر">
                حذف
              </Button>
            )}
          </div>

          {imgError && <p className="text-[11px] text-shangarf">{imgError}</p>}

          {state.bgImage && (
            <div className="flex items-center gap-3">
              <img
                src={state.bgImage}
                alt=""
                className="h-14 w-14 shrink-0 rounded-lg object-cover ring-1 ring-line/60 dark:ring-night-line"
              />
              <div className="min-w-0 flex-1">
                <Slider
                  label="شفافیت تصویر"
                  value={state.bgOpacity}
                  onChange={(bgOpacity) => patch({ bgOpacity })}
                  min={5}
                  max={100}
                  step={5}
                  format={(v) => `${toFa(v)}٪`}
                />
              </div>
            </div>
          )}

          <p className="text-[10.5px] leading-relaxed text-ink-2/70 dark:text-night-ink-2">
            تصویر فقط در همین مرورگر می‌ماند و در پیوند هم‌رسانی جا نمی‌گیرد. برای خوانایی، دانه و
            سایهٔ کاغذ روی تصویر هم می‌نشینند.
          </p>
        </div>

        </>
      ),
    },
    {
      id: 'texture',
      dock: 'بافت',
      title: 'بافت کاغذ',
      icon: <ScrollIcon />,
      hint: 'اثر روی خروجی',
      content: (
        <>
        <div className="flex flex-col gap-3.5">
          <Slider
            label="دانه‌ی کاغذ"
            value={state.grain}
            onChange={(grain) => patch({ grain })}
            min={0}
            max={200}
            step={5}
            format={(v) => `${toFa(v)}٪`}
          />
          <Slider
            label="سایه‌ی لبه‌ها"
            value={state.vignette}
            onChange={(vignette) => patch({ vignette })}
            min={0}
            max={100}
            step={5}
            format={(v) => `${toFa(v)}٪`}
          />
          <Slider
            label="لکه‌های کهنگی"
            value={state.foxing}
            onChange={(foxing) => patch({ foxing })}
            min={0}
            max={100}
            step={5}
            format={(v) => `${toFa(v)}٪`}
          />
          <Slider
            label="رگه‌های الیاف"
            value={state.fibers}
            onChange={(fibers) => patch({ fibers })}
            min={0}
            max={100}
            step={5}
            format={(v) => `${toFa(v)}٪`}
          />
          <Toggle label="تای میانی" checked={state.crease} onChange={(crease) => patch({ crease })} />
        </div>
        </>
      ),
    },
    {
      id: 'size',
      dock: 'اندازه',
      title: 'اندازه خروجی',
      icon: <ColumnIcon />,
      hint: <Dim w={fmt.w} h={fmt.h} />,
      content: (
        <>

        <div className="flex flex-col gap-4">
          <FormatPicker value={state.formatId} onChange={(formatId) => patch({ formatId })} />

          <Field
            label={
              <>
                کیفیت — <Dim w={fmt.w * scale} h={fmt.h * scale} /> پیکسل

              </>
            }
            as="div"
          >
            <Chips
              options={SCALES.map((s) => ({ id: s.id as number, label: s.label }))}
              value={scale}
              onChange={setScale}
            />

          </Field>

        </div>

        </>
      ),
    },
    {
      id: 'layout',
      dock: 'چیدمان',
      title: 'چیدمان',
      icon: <KongrehIcon />,
      content: (
        <>
        <div className="flex flex-col gap-3">
          <Field label="نوع شعر" as="div">
            <Chips
              options={(Object.keys(LAYOUT_LABELS) as Layout[]).map((l) => ({
                id: l,
                label: LAYOUT_LABELS[l],
              }))}
              value={state.layout}
              onChange={(layout) => patch({ layout })}
            />

          </Field>

          <Field label={`تزئین — ${ORNAMENT_LABELS[state.ornament] ?? ''}`} as="div">
            <OrnamentPicker value={state.ornament} onChange={(ornament) => patch({ ornament })} />
          </Field>

          {state.layout !== 'beit' && (
            <Field label="تراز" as="div">
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

        </>
      ),
    },
    {
      id: 'type',
      dock: 'حروف',
      title: 'حروف‌چینی',
      icon: <CuneiformIcon />,
      content: (
        <>
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

        </>
      ),
    },
  ]
  return sections
}
