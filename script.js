const { createElement } = require("react");

const form = document.querySelector('form');

form.addEventListener('submit',function(e) {
    e.preventDefault();
    const input = document.querySelector('input').value;
    const output = document.getElementById('out-put');
    output.innerHTML = `<li>${input}</li>`;
})

