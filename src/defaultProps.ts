import { mapValues } from 'lodash'
interface DefaultPropsType {
  [key: string]: {
    props: object;
    extraProps?: { [key: string]: any };
  };
}
// this contains all default props for all the components
// useful for inserting new component into the store
export const componentsDefaultProps: DefaultPropsType = {
  title: {
    props: {
      text: '大标题',
      fontSize: '30px',
      fontWeight: 'normal',
      lineHeight: '1',
      textAlign: 'left'
    },
    extraProps: {
      lineHeight: { min: 0, max: 10 }
    }
  },
  'l-link': {
    props: {
      text: '百度链接',
      href: 'javascript:void()',
      fontSize: '15px'
    }
  }
}

export const transformToComponentProps = (props: { [key: string]: any }) => {
  return mapValues(props, (item) => {
    return {
      type: item.constructor,
      default: item
    }
  })
}
export default componentsDefaultProps
