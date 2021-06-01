
const alertQueue = [];
const images = {
    "defaultImage": "images/donuts-stack2.png",
    "chocolate croissant": "images/donut-white.png"
}
var isShowingAlert = false;
const defaultAlertTime = 8000;

start();

function start(){

    $("#alertOverlay").hide();

    const queryString = window.location.search;
    console.log(queryString);
    const urlParams = new URLSearchParams(queryString);

    if(!urlParams.has('channel'))
    {
        console.error("channel is undefined");
    }
    else
    {
        const channel = urlParams.get('channel')
        console.log("connecting to "+channel+" chat");

        client = new tmi.client({
            connection: {
                reconnect: true,
                secure: true
            },
            channels: [channel]
        });

        //https://tmijs.com/
        client.on('message', (channel, tags, message, self) => {

            let displayText = `${tags['display-name']}: ${message}`;
            console.log(displayText);

            //for testing purpose
            message = "John Snow bought a chocolate croissant for 50 bits."
            let sep1 = " bought a ";
            let sep1idx = message.lastIndexOf(sep1);
            let sep2 = " for ";
            let sep2idx = message.lastIndexOf(sep2);
            let viewerName = message.substr(0, sep1idx);
            let pastry = message.substr(sep1idx + sep1.length, sep2idx - sep1idx - sep1.length); 
            let bits = message.substr(sep2idx + sep2.length, message.length - " bits.".length - sep2idx - sep2.length);


            enQueueAlert({message:message, viewerName:viewerName, pastry:pastry, bits:bits});
        });
        client.connect().catch(console.error);
    }

    function enQueueAlert(alert)
    {
        if(!isShowingAlert && alertQueue.length == 0)
        {
            showAlert(alert);
        }
        else
        {
            alertQueue.push(alert);
        }
    }
    
    function showAlert(alert)
    {
        isShowingAlert = true;
        setTimeout(hideAlert, defaultAlertTime);

        let imagesrc = (alert.pastry in images) ? images[alert.pastry] : images["defaultImage"];

        $("#alertImage").attr("src", imagesrc);
        $("#alertText").html(alert.message); // todo use other param to add color in text for viewer name and bits
        $("#alertOverlay").show();
    }

    function hideAlert(){
        $("#alertOverlay").hide();

        if(alertQueue.length != 0)
        {
            let alert = alertQueue.shift();
            showAlert(alert);
            return;
        }
        
        isShowingAlert = false;
    }
}
