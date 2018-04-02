const handleSubmit = (e) => {
  e.preventDefault();
  console.log(e)
}

$('.add-item-form').on('click', handleSubmit)