const form = document.querySelector('form')

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.querySelector('input');
    const valueInput = input.value.trim();
    if (valueInput=== '') {
        alert('nao envia');
        return;
    }
    const date = document.getElementById('date').value;
    let li = document.createElement('li')
    li.innerHTML = valueInput +'<span class = "delete" onclick="deleteTask(this)">🗑️</span>' + date;
    document.querySelector('ul').appendChild(li);
    input.value = '';

});


//função na qual deleto minha li criada dinamicamente
function deleteTask(li) {
   li.parentElement.remove();
}
