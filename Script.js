const display = document.getElementById("ascii-display");

const W = 52;
const H = 46;

const asciiChars = " .:-=+*#%@";

let angleX = 0.3;
let angleY = 0;

let bloomScale = 0.0;
let targetBloom = 1.0;
let bloomSpeed = 0.008;

function renderAsciiRose() {

    let buffer = Array(W * H).fill(" ");
    let zBuffer = Array(W * H).fill(0);

    if (bloomScale < targetBloom) {
        bloomScale += bloomSpeed;
    }

    for (let theta = 0; theta < Math.PI * 5; theta += 0.06) {

        for (let phi = 0; phi < Math.PI * 2; phi += 0.06) {

            let r =
                11 *
                (Math.sin(theta * 1.5) * bloomScale + 1.1) *
                (1 - 0.25 * Math.cos(phi * 5) * bloomScale);

            let x0 = r * Math.sin(theta) * Math.cos(phi);

            let y0 =
                r * Math.sin(theta) * Math.sin(phi) -
                (theta > Math.PI * 2.5
                    ? (theta - Math.PI * 2.5) * 4
                    : 0);

            let z0 = r * Math.cos(theta);

            let x1 =
                x0 * Math.cos(angleY) -
                z0 * Math.sin(angleY);

            let z1 =
                x0 * Math.sin(angleY) +
                z0 * Math.cos(angleY);

            let y2 =
                y0 * Math.cos(angleX) -
                z1 * Math.sin(angleX);

            let z2 =
                y0 * Math.sin(angleX) +
                z1 * Math.cos(angleX);

            let ooZ = 1 / (z2 + 45);

            let xp = Math.floor(
                W / 2 + x1 * 1.6 * ooZ * W * 0.42
            );

            let yp = Math.floor(
                H / 2 - y2 * ooZ * H * 0.42
            );

            if (
                xp >= 0 &&
                xp < W &&
                yp >= 0 &&
                yp < H
            ) {
                let idx = xp + yp * W;

                let luminance = Math.floor(
                    ((x1 + y2 + z2) / 28 + 1.2) * 4
                );

                luminance = Math.max(
                    0,
                    Math.min(
                        asciiChars.length - 1,
                        luminance
                    )
                );

                if (ooZ > zBuffer[idx]) {

                    zBuffer[idx] = ooZ;

                    buffer[idx] =
                        asciiChars[luminance];
                }
            }
        }
    }

    let output = "";

    for (let y = 0; y < H; y++) {

        for (let x = 0; x < W; x++) {

            output += buffer[x + y * W];
        }

        output += "\n";
    }

    display.textContent = output;

    angleY += 0.012;

    requestAnimationFrame(renderAsciiRose);
}

renderAsciiRose();
