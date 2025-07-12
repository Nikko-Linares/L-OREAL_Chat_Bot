// Get references to the DOM elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const responseContainer = document.getElementById('chatWindow');

// Initialize an array to keep track of the conversation history
let message = [
    { role: 'system', content: "You are a knowledgeable and friendly beauty consultant for L'Oréal. You provide expert advice on makeup, skincare, haircare, and beauty trends, always highlighting L'Oréal’s products and values. Your responses are helpful, approachable, and tailored to each user's needs. If a user's query is unrelated to beauty, kindly steer the conversation back on track." }
];

// Replace with your actual Cloudfalre Worker URL
const workerUrl = 'https://loralchatbot.ncandreia.workers.dev/';

// Add event listener to the form
chatForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission
    responseContainer.textContent = 'Searching...'; // Display a loading message

    // Add the user's message to the conversation history
    message.push({ role: 'user', content: userInput.value });

    try {
        // Send a POST request to your Cloudflare Worker
        // This worker will handle the request to the OpenAI API
        const response = await fetch(workerUrl, {
            method: 'POST', // We are POST-ing data to the API
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            // Send model details and system message
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: message,
                max_completion_tokens: 120, // Limits the response length to 120 tokens
                temperature: 0.7, // Controls the randomness of the response
                frequency_penalty: 0.5 // Adjusts the frequency of repeated phrases

            })
        });

        // Check if the response is not ok
        if (!response.ok) {
            throw new Error('HTTP error! Status: ${response.status}');
        }

        // Parse and store the response data
        const result = await response.json();

        // Add the AI's response to the conversation history
        message.push({ role: 'assistant', content: result.choices[0].message.content });

        // Display the response on the page
        responseContainer.textContent = result.choices[0].message.content;
    } catch (error) {
        // Handles any errors that occur during the fetch
        console.error('Error: ', error);
        responseContainer.textContent = 'Sorry, something went wrong while processing your request. Please try again later.';
        // Shows the error message in the response container
    }

    // Clear the user input field after submission
    userInput.value = '';
});
