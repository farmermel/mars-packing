const postItemDB = async name => {
  try {
    const idString = await fetch('api/v1/items', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const id = await idString.json();
    $('#item-input').val('');
  } catch(error) {
    console.log(error);
  }
}

const appendItem = name => {
  $('.packing-wrap').append(`
    <article>
      <h2>${name}</h2>
      <label for='check-${name}'>Packed</label>
      <input type='checkbox' id='check-${name}' />
      <button class="delete">Delete</button>
    </article>
  `)
}

const handleSubmit = (e) => {
  e.preventDefault();
  const name = $('#item-input').val();
  try {
    postItemDB(name);
    appendItem(name);
  } catch (error) {
    console.log(error);
  }
}

$('.add-item-form').on('submit', handleSubmit)