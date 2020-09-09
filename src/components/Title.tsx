import { pick } from 'lodash'

// default props for Title component
export const defaultProps = {
  text: 'Hello World',
  fontSize: '30px'
}

// array that contains style props
export const stylePropsArr = ['fontSize']

const Title = (props: any, context: any) => {
  const mergeProps = { ...defaultProps, ...props }
  const styleProps = pick(mergeProps, stylePropsArr)
  console.log(mergeProps)
  console.log(styleProps)
  return (
    <h2
      style={styleProps}
      onClick={ () => { context.emit('item-click', { name: 'Title', props: { ...mergeProps } }) } }>
      {props.text}
    </h2>
  )
}

export default Title
