const MentorAIView = () => `
<div class="max-w-4xl mx-auto py-20 px-6 animate-fade">
    <div class="text-center mb-12">
        <h2 class="text-4xl font-extrabold text-slate-900">Mentor AI</h2>
        <p class="mt-4 text-slate-500 text-lg">Upload your Math or Science doubt for a step-by-step solution.</p>
    </div>

    <div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div id="drop-zone" class="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-indigo-400 transition-colors cursor-pointer">
            <input type="file" id="file-input" accept="image/*" class="hidden">
            <div id="preview-container" class="hidden mb-4">
                <img id="image-preview" class="mx-auto max-h-64 rounded-lg shadow-md">
            </div>
            <div id="upload-prompt">
                <p class="text-slate-600 font-medium">Click to upload or drag & drop a photo</p>
                <p class="text-slate-400 text-sm mt-1">PNG, JPG up to 10MB</p>
            </div>
        </div>

        <button id="solve-btn" class="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            Get Step-by-Step Solution
        </button>

        <div id="solution-output" class="hidden mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 class="font-bold text-slate-800 mb-4 flex items-center">
                <span class="w-2 h-6 bg-indigo-500 rounded-full mr-3"></span>
                Mentor AI's Solution
            </h3>
            <div id="solution-text" class="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                </div>
        </div>
    </div>
</div>
`;
// --- Mentor AI Logic ---

// Replace with your key from https://aistudio.google.com/
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; 

const initMentorAI = () => {
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const solveBtn = document.getElementById('solve-btn');
    const outputArea = document.getElementById('solution-output');
    const outputText = document.getElementById('solution-text');
    const preview = document.getElementById('image-preview');
    const previewCont = document.getElementById('preview-container');
    const uploadPrompt = document.getElementById('upload-prompt');

    if (!fileInput) return; // Exit if not on Mentor AI page

    // 1. Handle File Selection
    dropZone.onclick = () => fileInput.click();

    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                preview.src = event.target.result;
                previewCont.classList.remove('hidden');
                uploadPrompt.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    };

    // 2. API Call on Button Click
    solveBtn.onclick = async () => {
        if (!fileInput.files[0]) {
            alert("Please upload an image first!");
            return;
        }

        // UI Loading State
        solveBtn.disabled = true;
        solveBtn.innerHTML = `<span class="flex items-center justify-center gap-2">
            <i data-lucide="loader-2" class="animate-spin w-5 h-5"></i> Thinking...
        </span>`;
        lucide.createIcons();

        try {
            const base64Data = await toBase64(fileInput.files[0]);
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: "Identify the educational problem in this image. Provide a detailed, step-by-step solution. If it's a Math or Science question, explain the concepts clearly for a Class 10-12 student." },
                            { inline_data: { mime_type: "image/jpeg", data: base64Data } }
                        ]
                    }]
                })
            });

            const data = await response.json();
            const resultText = data.candidates[0].content.parts[0].text;

            // Display Result
            outputArea.classList.remove('hidden');
            // Using .innerText for safety; for Markdown rendering, use marked.js
            outputText.innerText = resultText;
            
            // Smooth Scroll to Result
            outputArea.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error("API Error:", error);
            alert("Mentor AI is currently busy. Please check your API key or connection.");
        } finally {
            solveBtn.disabled = false;
            solveBtn.innerHTML = "Get Step-by-Step Solution";
            lucide.createIcons();
        }
    };
};

// Helper: Convert File to Base64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
});
