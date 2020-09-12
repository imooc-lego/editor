import { pick } from 'lodash'
import { computed } from 'vue'
const defaultStyles = ['fontSize', 'fontWeight', 'textAlign', 'lineHeight']

const useStylePick = (props: Readonly<any>, pickStyles = defaultStyles) => {
  return computed(() => pick(props, pickStyles))
}

export default useStylePick
