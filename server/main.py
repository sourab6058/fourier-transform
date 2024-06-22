from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
import cv2
import numpy as np
import io

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


def to_fourier(path):
    image = cv2.imread(path)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    fourier = cv2.dft(np.float32(gray), flags=cv2.DFT_COMPLEX_OUTPUT)
    fourier_shift = np.fft.fftshift(fourier)
    magnitude = 20 * np.log(
        cv2.magnitude(fourier_shift[:, :, 0], fourier_shift[:, :, 1])
    )
    magnitude = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8UC1)
    return magnitude


@app.post("/uploadimage/")
async def upload_image(file: UploadFile = File(...)):
    # writing UploadFIle image in local memory for processing
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb+") as f:
        f.write(file.file.read())

    magnitude = to_fourier(file_path)
    _, img_encoded = cv2.imencode(".png", magnitude)
    return StreamingResponse(io.BytesIO(img_encoded.tobytes()), media_type="image/png")
