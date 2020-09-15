import { pick, without } from 'lodash'
import { computed } from 'vue'
import { commonDefaultProps } from '../defaultProps'

const defaultStyles = without(Object.keys(commonDefaultProps), 'actionType', 'url', 'text')
const useStylePick = (props: Readonly<any>, pickStyles = defaultStyles) => {
  return computed(() => pick(props, pickStyles))
}

export default useStylePick
