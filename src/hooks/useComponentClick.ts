const useComponentClick = (props: any) => {
  const handleClick = () => {
    if (props.actionType && props.url && !props.isEditing) {
      window.location.href = props.url
    }
  }
  return handleClick
}

export default useComponentClick
