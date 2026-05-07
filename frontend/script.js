const API_URL = "https://smart-resume-ai-pbvo.onrender.com";

let lastAnalysis = null;
let lastOptimizedResume = null;

async function analyzeResume() {
    const resume = document.getElementById("resume").value;
    const job = document.getElementById("job").value;
    const result = document.getElementById("result");

    if (!resume || !job) {
        result.innerHTML = "<p>Preencha o currículo e a descrição da vaga.</p>";
        return;
    }

    result.innerHTML = "<p>Analisando currículo com IA...</p>";

    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                resume_text: resume,
                job_description: job
            })
        });

        const data = await response.json();
        lastAnalysis = data;

        result.innerHTML = `
            <div class="score-card">
                <h2>Score de Compatibilidade</h2>
                <div class="score">${data.score}/100</div>
                <div class="bar">
                    <div class="bar-fill" style="width: ${data.score}%"></div>
                </div>
            </div>

            <button class="pdf-btn" onclick="downloadPDF()">
                Baixar análise em PDF
            </button>

            <div class="grid">
                <div class="card">
                    <h3>Pontos Fortes</h3>
                    <ul>${data.strengths.map(item => `<li>${item}</li>`).join("")}</ul>
                </div>

                <div class="card">
                    <h3>Lacunas</h3>
                    <ul>${data.weaknesses.map(item => `<li>${item}</li>`).join("")}</ul>
                </div>

                <div class="card">
                    <h3>Melhorias Recomendadas</h3>
                    <ul>${data.improvements.map(item => `<li>${item}</li>`).join("")}</ul>
                </div>

                <div class="card">
                    <h3>Vagas Recomendadas</h3>
                    <ul>${data.recommended_roles.map(item => `<li>${item}</li>`).join("")}</ul>
                </div>
            </div>

            <div class="card full">
                <h3>Resumo Profissional Melhorado</h3>
                <p>${data.improved_summary}</p>
            </div>

            <div class="card full">
                <h3>Carta Curta de Candidatura</h3>
                <p>${data.cover_letter}</p>
            </div>
        `;
    } catch (error) {
        result.innerHTML = "<p>Erro ao conectar com a API online.</p>";
    }
}

async function uploadPDF() {
    const fileInput = document.getElementById("pdfFile");

    if (!fileInput.files.length) {
        alert("Selecione um PDF.");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const response = await fetch(`${API_URL}/upload-resume`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        document.getElementById("resume").value = data.text;

        alert("PDF carregado com sucesso!");
    } catch (error) {
        alert("Erro ao enviar PDF para a API online.");
    }
}

function downloadPDF() {
    if (!lastAnalysis) {
        alert("Faça uma análise primeiro.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text("Smart Resume AI - Análise de Currículo", 15, y);

    y += 15;

    doc.setFontSize(12);
    doc.text(`Score de Compatibilidade: ${lastAnalysis.score}/100`, 15, y);

    y += 15;

    const addSection = (title, content) => {
        doc.setFontSize(14);
        doc.text(title, 15, y);
        y += 8;

        doc.setFontSize(11);

        const text = Array.isArray(content)
            ? content.map(item => `- ${item}`).join("\n")
            : content;

        const lines = doc.splitTextToSize(text, 180);

        lines.forEach(line => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }

            doc.text(line, 15, y);
            y += 7;
        });

        y += 8;
    };

    addSection("Pontos Fortes", lastAnalysis.strengths);
    addSection("Lacunas", lastAnalysis.weaknesses);
    addSection("Melhorias Recomendadas", lastAnalysis.improvements);
    addSection("Resumo Profissional Melhorado", lastAnalysis.improved_summary);
    addSection("Carta Curta de Candidatura", lastAnalysis.cover_letter);
    addSection("Vagas Recomendadas", lastAnalysis.recommended_roles);

    doc.save("smart-resume-ai-analise.pdf");
}

async function generateResume() {
    const resume = document.getElementById("resume").value;
    const job = document.getElementById("job").value;
    const result = document.getElementById("result");

    if (!resume || !job) {
        alert("Preencha currículo e vaga.");
        return;
    }

    result.innerHTML = `
        <div class="card full">
            <h3>Gerando currículo otimizado...</h3>
        </div>
    `;

    try {
        const response = await fetch(`${API_URL}/generate-resume`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                resume_text: resume,
                job_description: job
            })
        });

        const data = await response.json();
        lastOptimizedResume = data.optimized_resume;

        result.innerHTML = `
            <div class="card full">
                <h2>Currículo Otimizado com IA</h2>

                <button class="resume-pdf-btn" onclick="downloadOptimizedResumePDF()">
                    Baixar Currículo Otimizado em PDF
                </button>

                <textarea class="optimized-textarea">${data.optimized_resume}</textarea>
            </div>
        `;
    } catch (error) {
        result.innerHTML = `
            <div class="card full">
                <h3>Erro ao gerar currículo pela API online.</h3>
            </div>
        `;
    }
}

function downloadOptimizedResumePDF() {
    if (!lastOptimizedResume) {
        alert("Gere o currículo otimizado primeiro.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text("Currículo Otimizado", 15, y);

    y += 12;

    doc.setFontSize(11);

    const lines = doc.splitTextToSize(lastOptimizedResume, 180);

    lines.forEach(line => {
        if (y > 280) {
            doc.addPage();
            y = 20;
        }

        doc.text(line, 15, y);
        y += 7;
    });

    doc.save("curriculo-otimizado-smart-resume-ai.pdf");
}