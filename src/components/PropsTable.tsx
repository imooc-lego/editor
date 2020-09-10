import maps from '../propsMap'
import { map } from 'lodash'
import { h } from 'vue'
const PropsTable = (props: any) => {
  console.log(props)
  return (
    <div class="props-tab">
      <h1>hello</h1>
      {
        map(props.props, (value, key) => {
          console.log(key)
          const { component, valueTransform, eventHandler, eventName } = maps[key]
          const TagName = component || 'a-input'
          const props = {
            value: valueTransform(value),
            onChange: (e: any) => { eventHandler(e, key) }
          }
          // const myComponent = <TagName {...props} />
          return <TagName {...props} />
        })
      }
    </div>
  )
}
export default PropsTable
