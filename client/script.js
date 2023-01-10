import bot from './images/bot.png'
import user from './images/user.png'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
        element.textContent += '.';  // Update text content of loading indicator

        if (element.textContent === '......') {  // If the load indicator has reached five dots, reset it
            element.textContent = '';
        }
    }, 280);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 18)
}

function generateUniqueId() {  // implement unique ID for each message div of bot,required for typing text effect for each reply
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}
// CHAT SECTION
function chatSection(isitAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isitAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img src=${isitAi ? bot : user} alt="${isitAi ? 'bot' : 'user'}" />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatSection
    chatContainer.innerHTML += chatSection(false, data.get('prompt'))
    form.reset()

    // bot's chatSection
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatSection(true, " ", uniqueId)

    chatContainer.scrollTop = chatContainer.scrollHeight;   

    const messageDiv = document.getElementById(uniqueId)  // specific message div
    loader(messageDiv)   // messageDiv.innerHTML = "..."

    const response = await fetch('https://coder-ai.onrender.com', {
        //https://coder-ai.onrender.com
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " ";

    if (response.ok) {  // if we get response
        const data = await response.json();
        const parsedData = data.bot.trim() 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})