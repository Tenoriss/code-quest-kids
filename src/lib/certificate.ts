export interface CertificateData {
  studentName: string;
  date: string;
  course: string;
  score: string;
}

export function generateCertificateHTML(data: CertificateData): string {
  return `
    <div style="
      width: 800px;
      height: 600px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
      position: relative;
      overflow: hidden;
    ">
      <div style="
        position: absolute;
        inset: 15px;
        border: 3px solid rgba(255,255,255,0.3);
        border-radius: 20px;
        pointer-events: none;
      "></div>
      <div style="font-size: 40px; margin-bottom: 10px;">🏆</div>
      <h1 style="font-size: 48px; margin: 10px 0; font-weight: 800; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
        Certificate of Completion
      </h1>
      <p style="font-size: 18px; opacity: 0.9; margin: 5px 0;">This certificate is proudly awarded to</p>
      <h2 style="font-size: 42px; margin: 15px 0; font-weight: 700; border-bottom: 3px solid rgba(255,255,255,0.5); padding-bottom: 10px;">
        ${data.studentName}
      </h2>
      <p style="font-size: 18px; opacity: 0.9; margin: 5px 0;">For completing</p>
      <h3 style="font-size: 28px; margin: 10px 0; font-weight: 600;">
        ${data.course}
      </h3>
      <p style="font-size: 16px; opacity: 0.8; margin: 5px 0;">with a score of ${data.score}</p>
      <div style="
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
        width: 80%;
        font-size: 14px;
        opacity: 0.8;
      ">
        <span>Date: ${data.date}</span>
        <span>Code Quest Kids</span>
      </div>
    </div>
  `;
}

export function downloadCertificate(data: CertificateData) {
  // Create a temporary container
  const container = document.createElement("div");
  container.innerHTML = generateCertificateHTML(data);
  document.body.appendChild(container);

  // Use html2canvas-like approach via canvas
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    document.body.removeChild(container);
    return;
  }

  // Draw a simple certificate
  const gradient = ctx.createLinearGradient(0, 0, 800, 600);
  gradient.addColorStop(0, "#667eea");
  gradient.addColorStop(1, "#764ba2");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 600);

  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 3;
  ctx.strokeRect(15, 15, 770, 570);

  ctx.fillStyle = "white";
  ctx.font = "bold 48px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🏆", 400, 80);

  ctx.font = "bold 44px 'Segoe UI', sans-serif";
  ctx.fillText("Certificate of", 400, 160);
  ctx.fillText("Completion", 400, 215);

  ctx.font = "18px 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText("This certificate is proudly awarded to", 400, 270);

  ctx.font = "bold 42px 'Segoe UI', sans-serif";
  ctx.fillStyle = "white";
  ctx.fillText(data.studentName, 400, 340);

  ctx.font = "18px 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText("For completing", 400, 390);

  ctx.font = "bold 28px 'Segoe UI', sans-serif";
  ctx.fillStyle = "white";
  ctx.fillText(data.course, 400, 435);

  ctx.font = "16px 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillText("with a score of " + data.score, 400, 475);

  ctx.font = "14px 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.textAlign = "left";
  ctx.fillText("Date: " + data.date, 100, 540);
  ctx.textAlign = "right";
  ctx.fillText("Code Quest Kids", 700, 540);

  // Download
  const link = document.createElement("a");
  link.download = `certificate-${data.studentName}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();

  document.body.removeChild(container);
}
