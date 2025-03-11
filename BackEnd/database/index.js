async function carregarClientes() {
    const response = await fetch('http://localhost:3000/clientes');
    const clientes = await response.json();
    console.log(clientes);
}

carregarClientes();