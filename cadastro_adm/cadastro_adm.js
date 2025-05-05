document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastroAdmForm');
    const mensagemDiv = document.getElementById('mensagem');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email_adm = document.getElementById('email_adm').value;
        const senha_adm = document.getElementById('senha_adm').value;

        try {
            const response = await fetch('/cadastro_adm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email_adm, senha_adm }),
            });

            const data = await response.json();

            if (response.ok) {
                mensagemDiv.className = 'success-message';
                mensagemDiv.textContent = data.message;
                form.reset();
            } else {
                mensagemDiv.className = 'error-message';
                mensagemDiv.textContent = data.error || 'Erro ao cadastrar administrador.';
            }

        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            mensagemDiv.className = 'error-message';
            mensagemDiv.textContent = 'Erro ao conectar com o servidor.';
        }
    });
});