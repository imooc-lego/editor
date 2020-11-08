import { mount } from '@vue/test-utils'
import IconSwitch from '../../components/IconSwitch.vue'
import Foo from './Foo.vue'

describe('IconSwitch.vue', () => {
  const props = {
    iconName: 'BoldOutlined',
    checked: false,
    tip: 'tip'
  }
  const wrapper = mount(IconSwitch, { 
    props, 
    global: {
      components: {
        'a-button': Foo,
        'a-tooltip': {
          template: `<div className="mock-tooltip">
            <slot name="title"></slot>
            <slot name="icon"></slot>
            <slot></slot>
          </div>`
        }   
      },
      stubs: {
        BoldOutlined: {
          template: '<span className="icon"/>'
        }
      }
    }
  })
  it('inital render', () => {
    console.log(wrapper.html())
    // should contain the tips
    expect(wrapper.find('.mock-tooltip').text()).toContain(props.tip)
    // should contain the button and type should be empty
    expect((wrapper.find('.stub-foo').attributes() as any).type).toBe('')
    // should contain the icon
    expect(wrapper.find('.icon').exists()).toBeTruthy()
  })
  it('change the props should render different layout', async () => {
    await wrapper.setProps({ checked: true })
    //  type should be primary
    expect((wrapper.find('.stub-foo').attributes() as any).type).toBe('primary')
  })
  it('click the element should emit the right event', () => {
    wrapper.trigger('click')
    console.log(wrapper.emitted())
    expect(wrapper.emitted()).toHaveProperty('change')
    expect(wrapper.emitted().change[0]).toEqual([false])
  })
})