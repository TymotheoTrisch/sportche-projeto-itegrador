const selectSport = document.querySelector('.select-sport')
const optionsSport = selectSport.querySelector(".content-sport .options");
const selectBtnSport = selectSport.querySelector('.select-btn-sport');

const selectState = document.querySelector('.select-state')
const optionsState = selectState.querySelector(".content-state .options");
const selectBtnState = selectState.querySelector('.select-btn-state');

$('.number-increment').click(function () {
  var $input = $(this).parents('.input-incrementor').find('#input-pendentes');
  var val = parseInt($input.val(), 10);
  
  $input.val(val + 1);
});

$('.number-decrement').click(function () {
  var $input = $(this).parents('.input-incrementor').find('#input-pendentes');
  var val = parseInt($input.val(), 10);
  if (val > 1) {
    $input.val(val - 1);
  }
});

$('.div-partida input').on('blur', function () {
  var $error = $(this).siblings('.error');
  
  if (!$(this).val()) { 
      $error.css('display', 'flex');
      $(this).css('outline', '1px solid red');
  } else {
      $error.css('display', 'none');
      $(this).css('outline', '0px');
      
  }
});

$('.div-partida textarea').on('blur', function () {
  var $error = $(this).siblings('.error');
  
  if (!$(this).val()) { 
      $error.css('display', 'flex');
      $(this).css('outline', '1px solid red');
  } else {
      $error.css('display', 'none');
      $(this).css('outline', '0px');
      
  }
});
$('.select-btn').on('click', function () {
  var $span = $(this).find('span');
  var $error = $(this).closest('.div-partida').find('.error');
  
  const $parent = $(this).closest('.select');
    
  if ($parent.hasClass('activeted') && $span.attr('data-id') === "") {
      $error.css('display', 'flex');
      $(this).css('outline', '1px solid red');
  } else {
      $error.css('display', 'none');
      $(this).css('outline', '0px');
  }
});

const handlePhone = (event) => {
  let input = event.target
  input.value = phoneMask(input.value)
}

const phoneMask = (value) => {
  if (!value) return ""
  value = value.replace(/\D/g,'')
  value = value.replace(/(\d{2})(\d)/,"($1) $2")
  value = value.replace(/(\d)(\d{4})$/,"$1-$2")
  return value
}

const sports = [
  {
    "id": 1,
    "name": "Futebol"
  },
  {
    "id": 2,
    "name": "Basquete"
  },
  {
    "id": 3,
    "name": "Vôlei"
  },
  {
    "id": 4,
    "name": "Tênis"
  }
]

const states = [
  { "id": 1, "name": "Acre" },
  { "id": 2, "name": "Alagoas" },
  { "id": 3, "name": "Amapá" },
  { "id": 4, "name": "Amazonas" },
  { "id": 5, "name": "Bahia" },
  { "id": 6, "name": "Ceará" },
  { "id": 7, "name": "Distrito Federal" },
  { "id": 8, "name": "Espírito Santo" },
  { "id": 9, "name": "Goiás" },
  { "id": 10, "name": "Maranhão" },
  { "id": 11, "name": "Mato Grosso" },
  { "id": 12, "name": "Mato Grosso do Sul" },
  { "id": 13, "name": "Minas Gerais" },
  { "id": 14, "name": "Pará" },
  { "id": 15, "name": "Paraíba" },
  { "id": 16, "name": "Paraná" },
  { "id": 17, "name": "Pernambuco" },
  { "id": 18, "name": "Piauí" },
  { "id": 19, "name": "Rio de Janeiro" },
  { "id": 20, "name": "Rio Grande do Norte" },
  { "id": 21, "name": "Rio Grande do Sul" },
  { "id": 22, "name": "Rondônia" },
  { "id": 23, "name": "Roraima" },
  { "id": 24, "name": "Santa Catarina" },
  { "id": 25, "name": "São Paulo" },
  { "id": 26, "name": "Sergipe" },
  { "id": 27, "name": "Tocantins" }
];


selectBtnState.addEventListener("click", () => selectState.classList.toggle("activeted"));

// Função para adicionar os estados
function addStates(selectedState) {
  optionsState.innerHTML = "";
  states.forEach(state => {
    let isSelected = state.name == selectedState ? "selected" : "";
    let li = `<li onclick="updateNameState(this)" data-id="${state.id}" class="${isSelected}">${state.name}</li>`;
    optionsState.insertAdjacentHTML("beforeend", li);
  });
}

function updateNameState(selectedLi) {
  addStates(selectedLi.innerText);
  selectState.classList.remove("activeted");
  selectBtnState.firstElementChild.innerText = selectedLi.innerText;
  selectBtnState.firstElementChild.dataset.id = selectedLi.dataset.id
}

addStates();

selectBtnSport.addEventListener("click", () => selectSport.classList.toggle("activeted"));

// Função para adicionar os esportes
function addSport(selectedSport) {
  optionsSport.innerHTML = "";
  sports.forEach(sport => {
    let isSelected = sport.name == selectedSport ? "selected" : "";
    let li = `<li onclick="updateNameSport(this)" data-id="${sport.id}" class="${isSelected}">${sport.name}</li>`;
    optionsSport.insertAdjacentHTML("beforeend", li);
  });
}

function updateNameSport(selectedLi) {
  addSport(selectedLi.innerText);
  selectSport.classList.remove("activeted");
  selectBtnSport.firstElementChild.innerText = selectedLi.innerText;
  selectBtnSport.firstElementChild.dataset.id = selectedLi.dataset.id
}

addSport();

// const itensMenuDesktop = document.querySelectorAll('.icon i');

// itensMenuDesktop.forEach(icon => {
//   icon.addEventListener('mouseover', () => {
//     icon.classList.add('bx-tada-hover')
//     setTimeout(
//       () => {
//         icon.classList.remove('bx-tada-hover')
//       },
//       1500
//     );
//   })
// })

// const iconMenuDesktop = document.getElementById('menu-desktop')
// const iconMenu = iconMenuDesktop.querySelector('i')

// iconMenuDesktop.addEventListener('click', () => {
//   console.log(iconMenu);
//   const itens = document.querySelector('.itens')
//   if(itens.style.position === 'absolute' && itens.style.opacity === '0') {
//     itens.style.position = 'inherit'
//     itens.style.opacity = '1'
//     itens.classList.add('openAnimationMenu')
//     itens.classList.remove('closeAnimationMenu')
    
//     iconMenu.style.paddingBottom = '25px'
//     iconMenu.classList.add('active')
//   } else {
//     itens.style.opacity = '0'
//     itens.style.position = 'absolute'
//     itens.classList.remove('openAnimationMenu')
//     itens.classList.add('closeAnimationMenu')
//     iconMenu.style.paddingBottom = '0px'
//     iconMenu.classList.remove('active')
//   }
  
// })