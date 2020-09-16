import { mapValues } from 'lodash'
interface DefaultPropsType {
  [key: string]: {
    props: object;
    extraProps?: { [key: string]: any };
  };
}

// the common default props, all the components should have these props
export const commonDefaultProps = {
  // basic props - font styles
  fontSize: '14px',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  lineHeight: '1',
  textAlign: 'left',
  color: '#000000',
  backgroundColor: '#ffffff',
  // actions
  actionType: '',
  url: '',
  // size
  height: '',
  marginLeft: '0px',
  marginRight: '0px',
  marginTop: '0px',
  // border type
  borderStyle: 'none',
  borderColor: '#000',
  borderWidth: '0',
  borderRadius: '0',
  // shadow and opacity
  // boxShadow: '',
  opacity: 1,
  // position and x,y
  position: '',
  left: '0',
  top: '0'
}
// this contains all default props for all the components
// useful for inserting new component into the store
export const componentsDefaultProps: DefaultPropsType = {
  'l-title': {
    props: {
      text: '大标题',
      ...commonDefaultProps,
      fontSize: '30px'
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
