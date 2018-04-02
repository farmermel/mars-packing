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
      <label for='packed-${item.id}'>Packed
        <input type='checkbox' id='packed-${item.id}' ${checked} />
      </label>
      <button id='delete-${item.id}'>Delete</button>
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
  try {
    const dbItemsString = await fetch('api/v1/items');
    const dbItems = await dbItemsString.json();
    const sortedItems = dbItems.sort((a, b) => {
      return a.id - b.id
    })
    dbItems.forEach(item => {
      appendItem(item);
    });
  } catch (error) {
    console.log(error);
  }
};

const togglePacked = async (event, id) => {
  const packed = $(event.target).prop('checked');
  try {
    await fetch(`/api/v1/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ packed }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.log(error)
  }
};

const deleteItem = async (event, id) => {
  try {
    await fetch(`/api/v1/items/${id}`, {
      method: 'DELETE'
    });
    $('.packing-wrap').empty();
    await loadItems();
  } catch (error) {
    console.log(error);
  }
};

const determineItemAction = (e) => {
  const action = $(e.target).attr('id').split('-');
  action[0] === 'packed' 
    ? togglePacked(e, action[1])
    : deleteItem(e, action[1]);
};

$('.packing-wrap').on('click', determineItemAction)
$('.add-item-form').on('submit', handleSubmit);

$('document').ready(() => {
  loadItems();
});