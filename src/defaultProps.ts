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
  boxShadow: '0 0 0 #000000',
  opacity: 1,
  // position and x,y
  position: '',
  left: '0',
  top: '0'
}
// this contains all default props for all the components
// useful for inserting new component into the store
export const componentsDefaultProps: DefaultPropsType = {
  'l-text': {
    props: {
      text: '正文内容',
      ...commonDefaultProps,
      fontSize: '14px'
    }
  }
}

export const transformToComponentProps = (props: { [key: string]: any }) => {
  return mapValues(props, (item) => {
    return {
      type: item.constructor,
      default: item
    }
  }) as { [key: string]: any }
}
export default componentsDefaultProps
