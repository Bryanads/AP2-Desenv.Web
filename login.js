const manipulaBotaoLogin = () => {
    const senha = document.getElementById("senha_input_field").value;
    const senhaCriptografada = hex_sha256(senha);

    if (senhaCriptografada === "ce855f48b7422de36b50512a9a0a06a59d4f2f6efac6f439456777a396773cc1") {
        sessionStorage.setItem('login', true);
        window.location.href = "index.html";
    } else {
        alert("Senha incorreta");
    }
};

document.getElementById("login_btn").onclick = manipulaBotaoLogin;
