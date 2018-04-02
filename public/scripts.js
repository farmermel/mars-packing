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

const appendItem = item => {
  const checked = item.packed ? 'checked' : '';
  $('.packing-wrap').prepend(`
    <article>
      <h2>${item.name}</h2>
      <label for='check-${item.id}'>Packed</label>
      <input type='checkbox' id='check-${item.id}' ${checked} />
      <button class="delete">Delete</button>
    </article>
  `)
}

const handleSubmit = (e) => {
  e.preventDefault();
  const name = $('#item-input').val();
  const nameObj = {
    name,
    packed: false
  };
  try {
    postItemDB(name);
    appendItem(nameObj);
  } catch (error) {
    console.log(error);
  }
};

const loadItems = async () => {
  const dbItemsString = await fetch('api/v1/items');
  const dbItems = await dbItemsString.json();
  dbItems.forEach(item => {
    appendItem(item);
  });
};

$('.add-item-form').on('submit', handleSubmit);

$('document').ready(() => {
  loadItems();
});