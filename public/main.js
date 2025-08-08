
// body: JSON.stringify({
//     user_input: question,
//     user_id: "guest",  // or dynamically assigned
//     timestamp: new Date().toISOString()
// })


async function askBuddy() {
    const question = document.getElementById("career-question").value.trim();
    const responseContent = document.getElementById("response-content");
    const responseArea = document.getElementById("response-area");
    console.log(question);
    if (!question) {
        responseContent.innerHTML = "<p>Please enter a question.</p>";
        responseArea.style.display = "block";
        return;
    }

    responseArea.style.display = "block";
    responseContent.innerHTML = `
        <div class="flex items-center">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-3"></div>
            Buddy is thinking... 🤔
        </div>`;

    try {
        const response = await fetch("http://localhost:5000/api/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_input : question
            })
        });

        const data = await response.json();

        if (data.reply) {
            responseContent.innerHTML = data.reply.replace(/\n/g, "<br>");
        } else {
            responseContent.innerHTML = "No response from the server.";
        }

    } catch (error) {
        console.error("Error:", error);
        responseContent.innerHTML = "❌ Something went wrong. Try again later.";
    }
}


async function fillQuestion(q) {
    document.getElementById("career-question").value = q;
}


async function sendToWebhook() {
    const userMessage = document.getElementById('userInput').value;
    const responsePara = document.getElementById('aiResponse');

    // Relay Webhook URL — replace this with your actual URL
    const webhookURL = "https://hook.relay.app/api/v1/playbook/cmdzp5cd21mld0pktejo078rw/trigger/cBQNkjw9mSJcCtZetrSz1Q";

    try {
        const res = await fetch(webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_input: userMessage
            })
        });

        const data = await res.json();
        responsePara.innerText = data.reply;
    } catch (error) {
        responsePara.innerText = "Error: " + error.message;
    }
}