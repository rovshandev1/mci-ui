import { TabsProps } from '../../types/ui'
import FilledTabs from './FilledTabs'
import OutlinedTabs from './OutlinedTabs'

const MciTabs = (props: TabsProps) => {
   if (props.variant === 'outlined') {
      return <OutlinedTabs {...props} />
   }
   return <FilledTabs {...props} />
}

export default MciTabs
