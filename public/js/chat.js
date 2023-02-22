const msgerForm = get(".msger-inputarea");
    const msgerInput = get(".msger-input");
    const msgerChat = get(".msger-chat");   
    const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
    const chatWith = get(".chatwith");
    const typing = get(".typing");
    const chatStatus = get(".chatStatus");
    const chatId = window.location.pathname.substr(6);
    let authUser;

    window.onload = function(){

        axios.get('/auth/user').then(res =>{
            authUser = res.data.authUser;
        }).then(()=>{
            axios.get(`/chat/${chatId}/get_messages`).then(res =>{
                appendMessages(res.data.messages);
            })
        })
    }
    
    msgerForm.addEventListener("submit", event => {
        event.preventDefault();

        const msgText = msgerInput.value;
        if (!msgText) return;
        //COdigo de envio
            axios
            .post('/message/sent', {
                message: msgText,
                chat_id:1
            }).then(res => {
                let data= res.data;
                appendMessage(data.user.name,PERSON_IMG,'rigth',data.content,data.created_at);
            }).catch ( error =>{
                console.log('H ocurrido un error');
                console.log(error);
            })
        msgerInput.value = "";
    });

    function appendMessages(messages){
        let side ='left';
        messages.forEach(message =>{
            side = (message.user_id == authUser.id) ? 'right' : 'left';
            appendMessage(message.user.name,PERSON_IMG,side,message.content,message.created_at)
        })
    }
    function appendMessage(name, img, side, text,date) {
    
    const msgHTML = `
        <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>

        <div class="msg-bubble">
            <div class="msg-info">
            <div class="msg-info-name">${name}</div>
            <div class="msg-info-time">${date}</div>
            </div>

            <div class="msg-text">${text}</div>
        </div>
        </div>
    `;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
    }

    //Escuchar con laravel echo
    Echo.join(`chat.${chatId}`)
    
        .listen(`MessageSent`,(e) =>{
        console.log(e);
        appendMessage(e.message.user.name,PERSON_IMG,'left',e.message.content,e.message.created_at)
    })

    // Utils
    function get(selector, root = document) {
    return root.querySelector(selector);
    }

    function formatDate(date) {
    const d = date.getDate();
    const mo = date.getMonth() +1;
    const y = date.getFullYear();
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();

    return `${d}/${mo}/${y} ${h.slice(-2)}:${m.slice(-2)}`;
    }