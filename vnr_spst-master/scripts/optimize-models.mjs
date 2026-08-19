// Nén model 3D: đọc bản gốc trong assets-source/models, ghi bản đã nén vào
// public/assets/models. Chạy lại mỗi khi thêm hoặc thay model gốc.
//
//   npm run optimize:models
//
// Nén bằng EXT_meshopt_compression vì drei bật sẵn MeshoptDecoder (đóng gói
// trong three-stdlib), không cần tải decoder từ CDN ngoài như Draco.
//
// Texture được thu nhỏ bằng sharp ở bước prepare() bên dưới, không dùng
// --texture-compress của gltf-transform (xem lý do tại prepare()).

import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { prune } from "@gltf-transform/functions";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = join(root, "assets-source", "models");
const OUT_DIR = join(root, "public", "assets", "models");

// Chỉ những model có mặt ở đây mới được nén và ghi vào public/. File nào còn
// trong assets-source/ nhưng không có cấu hình sẽ bị bỏ qua — đó là cách gỡ một
// model khỏi bảo tàng mà vẫn giữ bản gốc để dùng lại sau.
//
// simplifyRatio: tỉ lệ đỉnh giữ lại. Các model quét photogrammetry từ Sketchfab
// có độ chi tiết cao gấp nhiều lần mức cần thiết cho một hiện vật trưng bày.
const MODELS = {
  // Máy chữ Chiến khu Việt Bắc (1947–1954): ~1,5 triệu tam giác cho một vật thể
  // cao chưa tới 1 đơn vị.
  "72d50626ee0843fbb774ba9585e0c793.glb": {
    simplifyRatio: 0.08,
    simplifyError: 0.005,
  },
};

// Các tuỳ chọn khác mà `prepare()` hiểu, để dùng lại khi thêm model mới:
//   simplify: false      — bỏ hẳn bước giảm lưới (model vốn đã ít mặt)
//   textureSize: 512     — thu nhỏ mọi texture về tối đa 512²
//   dropLines: true      — gỡ mesh dạng đường (bản quét hay kèm lưới viền thừa)
//   extraArgs: [...]     — cờ truyền thẳng cho `gltf-transform optimize`; cần
//                          "--flatten false --join false --instance false
//                          --palette false" nếu component tra node theo tên,
//                          vì các bước đó gộp và đổi tên node.

// Gọi thẳng file JS thay vì shim trong .bin: Node 24 trên Windows từ chối
// spawn file .cmd (EINVAL).
const cli = join(root, "node_modules", "@gltf-transform", "cli", "bin", "cli.js");

mkdirSync(OUT_DIR, { recursive: true });

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2);
const io = new NodeIO();
let totalBefore = 0;
let totalAfter = 0;

// Xử lý bản gốc trước khi đưa qua `optimize`: bỏ mesh dạng đường và thu nhỏ
// texture. Làm ở bước này để không phải giải nén meshopt rồi nén lại.
//
// Texture do sharp xử lý trực tiếp, không dùng --texture-compress của
// gltf-transform: bản 4.4 gọi libvips theo cách không còn hợp lệ với libvips
// 8.17 và luôn báo "colourspace: parameter space not set". Giữ nguyên định dạng
// gốc (PNG/JPEG) nên không phải thêm extension EXT_texture_webp.
async function prepare(input, config) {
  if (!config.dropLines && !config.textureSize) return input;

  const doc = await io.read(input);

  if (config.dropLines) {
    const LINE_MODES = new Set([1, 2, 3]); // LINES, LINE_LOOP, LINE_STRIP
    for (const mesh of doc.getRoot().listMeshes()) {
      for (const prim of mesh.listPrimitives()) {
        if (LINE_MODES.has(prim.getMode())) {
          mesh.removePrimitive(prim);
          prim.dispose();
        }
      }
      if (mesh.listPrimitives().length === 0) mesh.dispose();
    }
    await doc.transform(prune());
  }

  if (config.textureSize) {
    const size = config.textureSize;
    for (const texture of doc.getRoot().listTextures()) {
      const image = texture.getImage();
      if (!image) continue;
      let pipeline = sharp(Buffer.from(image)).resize(size, size, {
        fit: "inside",
        withoutEnlargement: true,
      });
      pipeline =
        texture.getMimeType() === "image/jpeg"
          ? pipeline.jpeg({ quality: 88 })
          : pipeline.png({ compressionLevel: 9 });
      texture.setImage(new Uint8Array(await pipeline.toBuffer()));
    }
  }

  const temp = join(OUT_DIR, `.tmp-${Date.now()}.glb`);
  await io.write(temp, doc);
  return temp;
}

for (const file of readdirSync(SRC_DIR).filter((f) => f.endsWith(".glb"))) {
  const config = MODELS[file];
  if (!config) {
    console.log(`- bỏ qua ${file} (không có cấu hình, không được dùng trong scene)`);
    continue;
  }

  const source = join(SRC_DIR, file);
  const output = join(OUT_DIR, file);
  const input = await prepare(source, config);

  const args = [
    "optimize", input, output,
    "--compress", "meshopt",
    "--texture-compress", "false",
  ];
  if (config.simplify === false) {
    args.push("--simplify", "false");
  } else {
    args.push("--simplify-ratio", String(config.simplifyRatio));
    args.push("--simplify-error", String(config.simplifyError));
  }
  if (config.extraArgs) args.push(...config.extraArgs);

  try {
    execFileSync(process.execPath, [cli, ...args], { stdio: ["ignore", "ignore", "inherit"] });
  } finally {
    if (input !== source) rmSync(input, { force: true });
  }

  const before = statSync(source).size;
  const after = statSync(output).size;
  totalBefore += before;
  totalAfter += after;
  console.log(`✔ ${file}: ${mb(before)} MB → ${mb(after)} MB`);
}

console.log(`\nTổng: ${mb(totalBefore)} MB → ${mb(totalAfter)} MB`);
