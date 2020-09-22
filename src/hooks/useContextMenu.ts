import { onMounted, onUnmounted, Ref } from 'vue'

const useContextMenu = (domRef: Ref<null | HTMLElement>) => {
  onMounted(() => {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      console.log(domRef.value)
      // alert('you right click it')
      if (domRef.value) {
        const domElement = domRef.value
        domElement.style.display = 'block'
        domElement.style.top = e.pageY + 'px'
        domElement.style.left = e.pageX + 'px'
      }
    })
  })
}

export default useContextMenu
