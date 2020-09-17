import { pick, without } from 'lodash'
import { computed } from 'vue'
import { textDefaultProps } from '../defaultProps'

export const defaultStyles = without(Object.keys(textDefaultProps), 'actionType', 'url', 'text')
const useStylePick = (props: Readonly<any>, pickStyles = defaultStyles) => {
  return computed(() => pick(props, pickStyles))
}

export default useStylePick
