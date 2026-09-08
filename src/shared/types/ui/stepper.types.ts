export interface Step {
    key: string | number
    label: string
    value: string
}

export type StepperColors = 'orange' | 'blue' | 'yellow' | 'amber'

export interface StepperProps {
    steps: Step[]
    activeStep: string | number
    darkMode?: boolean
    className?: string
    color?: StepperColors
}
