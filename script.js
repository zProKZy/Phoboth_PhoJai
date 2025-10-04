var video = document.getElementById("videoElement");
var captureBtn = document.getElementById("captureButton");
var photosContainer = document.getElementById("photos");
var timerInput = document.getElementById("timer");
var stripBtn = document.getElementById("stripButton");

const bgSelector = document.getElementById("bgSelector");
const container = document.querySelector(".container");

let capturedPhotos = []; // เก็บ <img> ของรูปที่ถ่ายมา

bgSelector.addEventListener("change", () => {
  if (bgSelector.value === "pink") {
    container.style.background = "radial-gradient(125% 125% at 50% 10%, #ffd2ec 40%, rgb(255, 0, 200) 100%)";
  } else if (bgSelector.value === "blue") {
    container.style.background = "radial-gradient(125% 125% at 50% 10%, #cce0ff 40%, #0066ff 100%)";
  } else if (bgSelector.value === "green") {
    container.style.background = "radial-gradient(125% 125% at 50% 10%, #d4ffd6 40%, #00cc00 100%)";
  } else if (bgSelector.value === "yellow") {
    container.style.background = "radial-gradient(125% 125% at 50% 10%, #fff5cc 40%, #ffcc00 100%)";
  }
});

// Access the device camera
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
}).catch((err) => {
    console.error("Error accessing camera: ", err);
});

timerInput.addEventListener("input", () => {
    if (parseInt(timerInput.value) > 30) timerInput.value = 30;
    if (parseInt(timerInput.value) < 0) timerInput.value = 0;
});

captureBtn.addEventListener("click", () => {
    var timer = parseInt(timerInput.value); 
    if (timer > 0) {
        captureBtn.disabled = true;
        var countdown = setInterval(() => {
            captureBtn.textContent = `กำลังถ่ายใน ${timer} วิ...`;
            timer--;
            if (timer < 0) {
                clearInterval(countdown);
                captureBtn.textContent = "ถ่ายรูปเลย!";
                captureBtn.disabled = false;
                capturePhoto();
            }
        }, 1000);
    } else {
        capturePhoto();
    }
});

function capturePhoto() {
    if (capturedPhotos.length >= 4) {
        alert("ถ่ายได้แค่ 4 รูปเท่านั้น");
        return;
    }

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    var dataURL = canvas.toDataURL("image/png");
    var img = new Image();
    img.src = dataURL;

    capturedPhotos.push(img);

    // แสดงรูป preview
    var photoDiv = document.createElement("div");
    photoDiv.classList.add("photo");

    var preview = document.createElement("img");
    preview.src = dataURL;
    photoDiv.appendChild(preview);

    // ปุ่มลบ
    var removeBtn = document.createElement("button");
    removeBtn.textContent = "ลบรูปภาพ";
    removeBtn.style.backgroundColor = "#ff5252";
    removeBtn.addEventListener("click", () => {
        photosContainer.removeChild(photoDiv);
        capturedPhotos = capturedPhotos.filter(p => p.src !== dataURL);

        // ถ้ายังไม่ครบ 4 → disable ปุ่ม
        if (capturedPhotos.length < 4) {
            stripBtn.disabled = true;
            stripBtn.classList.remove("enabled");
        }
    });

    // ปุ่มดาวน์โหลด
    var downloadBtn = document.createElement("button");
    downloadBtn.textContent = "ดาวน์โหลด";
    downloadBtn.style.backgroundColor = "#52b7ff";
    downloadBtn.addEventListener("click", () => {
        var a = document.createElement("a");
        a.href = dataURL;
        a.download = "photo.png";
        a.click();
    });

    let btnBox = document.createElement("div");
    btnBox.style.display = "flex";
    btnBox.style.gap = "8px";
    btnBox.appendChild(downloadBtn);
    btnBox.appendChild(removeBtn);
    photoDiv.appendChild(btnBox);

    photosContainer.appendChild(photoDiv);

    // ✅ เมื่อครบ 4 รูป → ปุ่ม stripButton สีเขียว ใช้งานได้
    if (capturedPhotos.length === 4) {
        stripBtn.disabled = false;
        stripBtn.classList.add("enabled");
    }
}

// กดรวม strip
stripBtn.addEventListener("click", () => {
    if (capturedPhotos.length === 4) {
        createPhotoStrip(capturedPhotos);
    } else {
        alert("ต้องถ่ายให้ครบ 4 รูปก่อน!");
    }
});

function createPhotoStrip(images) {
    if (images.length !== 4) {
        alert("ต้องถ่ายให้ครบ 4 รูปก่อน!");
        return;
    }

    const singleWidth = 200; 
    const singleHeight = 150;
    const spacing = 20;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = singleWidth;
    canvas.height = singleHeight * 4 + spacing * 3;

    images.forEach((img, i) => {
        ctx.drawImage(img, 0, i * (singleHeight + spacing), singleWidth, singleHeight);
    });

    const finalURL = canvas.toDataURL("image/png");

    // 🔹 เก็บค่าไว้ใน localStorage
    localStorage.setItem("photoStrip", finalURL);

    // 🔹 เปิดหน้าใหม่
    window.location.href = "strip.html";
}

// stripBtn.addEventListener("click", () => {
//     createPhotoStrip(capturedPhotos);
//     stripBtn.style.display = "none";
// });

// function createPhotoStrip(images) {
//     if (images.length !== 4) {
//         alert("ต้องถ่ายให้ครบ 4 รูปก่อน!");
//         return;
//     }

//     const singleWidth = 200; 
//     const singleHeight = 150;
//     const spacing = 20;

//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     canvas.width = singleWidth;
//     canvas.height = singleHeight * 4 + spacing * 3;

//     images.forEach((img, i) => {
//         ctx.drawImage(img, 0, i * (singleHeight + spacing), singleWidth, singleHeight);
//     });

//     const finalURL = canvas.toDataURL("image/png");

//     const stripImg = document.createElement("img");
//     stripImg.src = finalURL;
//     stripImg.style.marginTop = "20px";
//     photosContainer.appendChild(stripImg);

//     const a = document.createElement("a");
//     a.href = finalURL;
//     a.download = "photostrip.png";
//     a.textContent = "ดาวน์โหลด Photo Strip";
//     a.style.display = "block";
//     a.style.marginTop = "10px";
//     photosContainer.appendChild(a);
// }