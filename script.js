
const form = document.querySelector('form')

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const inputValor = document.querySelector('input').value;
    let li = document.createElement('li')
    li.innerHTML = inputValor  +'<span class = "delete" onclick="deleteTask(this)">🗑️</span>' + '<span class = "edit" onclick="editTask(this)">✍</span>';
    document.querySelector('ul').appendChild(li);
    inputValor = '';
    
})

function deleteTask(li) {
   li.parentElement.remove();
}

function editTask (li) {
    li.parentElement.editTask()
}
