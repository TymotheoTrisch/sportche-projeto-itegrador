//Requisições HTTP
const token = localStorage.getItem("token");
const profileName = document.getElementById("userName");

// Fução para a formatação da data
function convertDate(isoDate) {
    const date = new Date(isoDate);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
}

// Função para pegar a localização do usuário conforme
async function getLocation() {
    try {
        const APIResponse = await fetch(`http://ip-api.com/json/`);
        if (!APIResponse.ok) {
            throw new Error("Failed to fetch location");
        }
        const matchData = await APIResponse.json();

        return matchData.city;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Evento que faz uma requisição para os dados do usuário
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://localhost:3000/profile", {
            method: "GET",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const matchData = await response.json();
        profileName.innerHTML = matchData[0].username;

        document.querySelector(".access-main").addEventListener("click", () => {
            let confirmation = confirm("Quer realmente sair da conta?");

            if (confirmation) {
                localStorage.removeItem("token");
                window.location.href = "../../index.html";
            }
        });

        document.querySelector(".information-main").addEventListener("click", async () => {
            const modal = document.querySelector("dialog");
            modal.showModal();

            const current_city = await getLocation();

            const name = document.getElementById("name");
            const email = document.getElementById("email-in-use");
            const city = document.getElementById("current-city");
            const date = document.getElementById("date");

            name.innerHTML = matchData[0].username;
            email.innerHTML = `<b>Email atual:</b><p>${matchData[0].email}</p>`;
            city.innerHTML = `<b>Cidade atual:</b><p>${current_city}</p>`;
            date.innerHTML = `<b>Criado em:</b><p>${convertDate(matchData[0].created_at)}</p>`;

            document.getElementById("close").addEventListener("click", () => {
                modal.close();
            });
        });
    } catch (e) {
        console.error("Error:", e);
        alert("Erro ao consultar o usuário");
    }
});

// Função para pegar a imagem do esporte
function getSportIcon(number) {
    let iconPath;

    switch (number) {
        case 1:
            iconPath = "../img/icon_futebol.png";
            break;
        case 3:
            iconPath = "../img/icon_volei.png";
            break;
        case 2:
            iconPath = "../img/icon_basquete.png";
            break;
        case 4:
            iconPath = "../img/icon_tenis.png";
            break;
    }

    return iconPath;
}

// Função para formatar o horário
function formatTime(time) {
    return time.substring(0, 5);
}


// Seção das partidas criadas
const myMatches = document.getElementById("myMatches");

// Evento que faz uma requisição para os dados das partidas criadas
myMatches.addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:3000/profile/my-matches", {
            method: "GET",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();

        const list = document.getElementById("minhas-partidas");
        list.innerHTML = "";

        if (response.status === 400) {
            list.innerHTML = "<p class='err-modal'>Você não cadastrou nenhuma partida.</p>";
        } else {
            data.forEach((match) => {
                let li = document.createElement("li");
                li.innerHTML = `
                <div class="my-item-list">
                    <img src=${getSportIcon(match.id_sport)}>
                    <div class="nameTimeAndAdress">
                        <h4>${match.name.toUpperCase()}</h4>
                        <div class ="timeAndCtt">
                            <h3>${formatTime(match.start_match)} - ${formatTime(match.end_of_match)}</h3>
                            <h3>${match.street}</h3>
                        </div>
                    </div> 
                </div>
                <div class="btn-excluir">
                    <button id="btn-excluir-partidas" onclick="deleteMatch(${match.id_match})">Excluir</button>
                </div>
                `;
                list.appendChild(li);
            });
        }

        document.getElementById("modalMyMatches").showModal();

        document.getElementById("closeMM").addEventListener("click", () => {
            list.innerHTML = "";
            document.getElementById("modalMyMatches").close();
        });
    } catch (e) {
        console.error("Error:", e);
        alert("Erro ao consultar o usuário");
    }
});

// Função para deletar a partida
async function deleteMatch(id) {
    try {
        const response = await fetch(`http://localhost:3000/profile/match/${id}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 201) {
            alert("Partida deletada com sucesso.");
            window.location.reload();
        } else if (response.status == 402) {
            alert("Erro ao deletar a partida, por favor atualize a página.");
        }
    } catch (err) {
        console.log(err);
    }
}

// Função para entrar em contato pelo WhatsApp
function redirectWpp(contact) {
    window.location.href = `https://wa.me/55${contact}`
}

// Seção das partidas cadastradas
const schedule = document.getElementById("schedule");

// Evento que faz uma requisição para os dados das partidas registradas
schedule.addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:3000/profile/joined-matches", {
            method: "GET",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();

        const list = document.getElementById("partidas-agendadas");
        list.innerHTML = "";


        if (response.status === 400) {
            list.innerHTML = "<p class='err-modal'>Você não se inscreveu em nenhuma partida.</p>";
        } else {
            data.forEach((match) => {
                let li = document.createElement("li");
                li.innerHTML = `
                <div class="item-list-match">
                    <img class="ball" src=${getSportIcon(match.id_sport)}>
                    <div class="nameTimeAndAdress">
                        <h3 class="name-match">${match.name}</h3>
                        <div class ="timeAndCtt">
                            <h3 class = "time">${match.start_match} - ${match.end_of_match}</h3>
                            <h3>${match.street}, ${match.city}</h3>
                            <h3 class="img-contato" onclick="redirectWpp(${match.contact_phone})"><img class="whatsapp" src="../img/whats.png"> WhatsApp</h3>
                        </div>
                    </div>   
                    <div class="div-botao">
                        <button class="botao-sair" onclick="exitMatch(${match.players_registered}, ${match.id_match})">Sair da partida</button>
                    </div>
                </div>
                `;
                list.appendChild(li);
            });
        }

        document.getElementById("modalSchedule").showModal();

        document.getElementById("closeS").addEventListener("click", () => {
            list.innerHTML = "";
            document.getElementById("modalSchedule").close();
        });
    } catch (err) {
        console.error(err);
    }
});


// Função para sair da partida
async function exitMatch(playersRegistered, idMatch) {
    try {
        const response = await fetch(`http://localhost:3000/profile/participant/${idMatch}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                playersRegistered: playersRegistered,
            }),
        });

        if (response.status === 201) {
            alert("Você saiu dessa partida com sucesso.");
            window.location.reload();
        } else if (response.status === 401) {
            alert("Nenhuma partida encontrada.");
        } else if (response.status === 400) {
            alert("Erro ao sair da partida, por favor atualize a página.");
        }
    } catch (err) {
        console.log(err);
        alert("Ocorreu um erro inesperado. Tente novamente mais tarde.");
    }
}