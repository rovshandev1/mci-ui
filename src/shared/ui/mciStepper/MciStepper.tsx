import { type CSSProperties, useMemo } from 'react'
import { StepperColors, StepperProps } from '../../types/ui/stepper.types'
import { cn } from '../../lib/utils'

type ColorConfig = {
   bg: { dark: string; light: string }
   text: { dark: string; light: string }
   ring: { dark: string; light: string }
   line: { dark: string; light: string }
}

const createColorConfig = (
   bg: ColorConfig['bg'],
   text: ColorConfig['text'],
   ring: ColorConfig['ring'],
   line: ColorConfig['line']
): ColorConfig => ({ bg, text, ring, line })

const COLOR_MAP: Record<StepperColors, ColorConfig> = {
   orange: createColorConfig(
      { dark: 'bg-orange-500', light: 'bg-orange-600' },
      { dark: 'text-orange-500', light: 'text-orange-600' },
      { dark: 'ring-orange-500', light: 'ring-orange-600' },
      { dark: '#EB9369', light: '#E3620C' }
   ),
   blue: createColorConfig(
      { dark: 'bg-blue-400', light: 'bg-blue-600' },
      { dark: 'text-blue-400', light: 'text-blue-600' },
      { dark: 'ring-blue-400', light: 'ring-blue-600' },
      { dark: '#51A2FF', light: '#155DFC' }
   ),
   yellow: createColorConfig(
      { dark: 'bg-yellow-400', light: 'bg-yellow-500' },
      { dark: 'text-yellow-400', light: 'text-yellow-500' },
      { dark: 'ring-yellow-400', light: 'ring-yellow-500' },
      { dark: '#FCC800', light: '#EFB100' }
   ),
}

const MciStepper = ({ steps, activeStep, color = 'orange', darkMode, className }: StepperProps) => {
   const activeIndex = useMemo(
      () => steps.findIndex((s) => s.key === activeStep),
      [activeStep, steps]
   )

   const underline = useMemo(() => {
      const n = steps.length
      if (n <= 1 || activeIndex < 0) return 0
      return ((activeIndex + 1) / n) * 100
   }, [activeIndex, steps.length])

   const { bg, text, ring, line } = COLOR_MAP[color]

   return (
      <div
         className={cn(
            'relative flex w-full min-w-0 items-center overflow-hidden rounded-xl p-6',
            darkMode ? 'bg-primary' : 'bg-white',
            className
         )}
      >
         {/* bottom progress bar */}
         <div className="absolute bottom-0 left-0 h-0.5 w-full">
            <div
               className={cn('absolute inset-0', darkMode ? 'bg-slate-200/20' : 'bg-slate-200')}
            />
            <div
               className={cn(
                  'relative h-full transition-[width] duration-500 ease-out',
                  darkMode ? bg.dark : bg.light
               )}
               style={{ width: `${underline}%` }}
            />
         </div>

         <div className="flex w-full min-w-0 items-center">
            {steps.map((step, index) => {
               const isActive = index === activeIndex
               const isDone = index < activeIndex
               const isLast = index === steps.length - 1

               return (
                  <div
                     key={step.key}
                     className={cn('flex min-w-0 items-center', isLast ? 'shrink-0' : 'flex-1')}
                  >
                     {/* step circle */}
                     <div
                        className={cn(
                           'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-medium',
                           'lg:h-9 lg:w-9 lg:text-sm',
                           '2xl:h-10 2xl:w-10 2xl:text-base',
                           darkMode
                              ? 'shadow-[0px_0px_8px_0px_#99999952_inset]'
                              : 'shadow-[0px_0px_8px_0px_#FFFFFF66_inset]',
                           isActive
                              ? cn('text-white', darkMode ? bg.dark : bg.light)
                              : isDone
                                ? cn(
                                     darkMode ? text.dark : text.light,
                                     'ring-1',
                                     darkMode ? ring.dark : ring.light
                                  )
                                : darkMode
                                  ? 'bg-slate-200/20 text-slate-400 ring-1 ring-slate-200/20'
                                  : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
                        )}
                     >
                        {index + 1}
                     </div>

                     {/* step labels */}
                     <div className="ml-2 flex flex-col gap-1">
                        <span
                           className={cn(
                              'min-w-0 truncate text-sm font-medium',
                              isActive || isDone
                                 ? darkMode
                                    ? text.dark
                                    : text.light
                                 : darkMode
                                   ? 'text-slate-300'
                                   : 'text-primary'
                           )}
                           title={step.label}
                        >
                           {step.label}
                        </span>
                        <span className="text-xs text-slate-400">{step.value}</span>
                     </div>

                     {/* connector line */}
                     {!isLast && (
                        <div className="mr-4 ml-4 min-w-0 flex-1">
                           <div className="relative h-px w-full overflow-hidden rounded">
                              {!isActive && (
                                 <div
                                    className={cn(
                                       'absolute inset-0',
                                       darkMode ? 'bg-slate-200/20' : 'bg-slate-200'
                                    )}
                                 />
                              )}
                              {isDone && (
                                 <div
                                    className={cn(
                                       'absolute inset-0',
                                       darkMode ? bg.dark : bg.light
                                    )}
                                 />
                              )}
                              {isActive && (
                                 <div
                                    className="mci-stepper-line-flow absolute inset-0"
                                    style={{
                                       '--mci-stepper-line-color': darkMode ? line.dark : line.light,
                                    } as CSSProperties}
                                 />
                              )}
                           </div>
                        </div>
                     )}
                  </div>
               )
            })}
         </div>
      </div>
   )
}

export default MciStepper
