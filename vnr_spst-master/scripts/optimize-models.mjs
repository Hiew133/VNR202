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
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
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
  // Tượng đài Bác đọc Tuyên ngôn Độc lập, sảnh chính. DetailedMonument.tsx tra
  // cứu node theo tên (nodes.Material2, nodes.Material3) nên phải tắt
  // flatten/join/instance/palette — các bước đó gộp và đổi tên node, tượng sẽ
  // biến mất mà không báo lỗi. dropLines gỡ mesh viền của bản quét (~1 MB) mà
  // component không render.
  "tuong_bac.glb": {
    simplifyRatio: 0.5,
    simplifyError: 0.003,
    dropLines: true,
    extraArgs: [
      "--flatten", "false",
      "--join", "false",
      "--instance", "false",
      "--palette", "false",
    ],
  },
  // Biểu tượng búa liềm, sảnh chính. Chỉ 444 tam giác nên không giảm lưới;
  // toàn bộ trọng lượng nằm ở bộ texture 1024² (riêng normal map 1,26 MB).
  "communist_badge.glb": { simplify: false, textureSize: 512 },

  // ===== Phòng 1: 1945 - 1946 =====
  // Thùng phiếu Tổng tuyển cử 6/1/1946. Vốn đã rất nhẹ (1.254 mặt).
  ballot_box: { simplify: false, textureSize: 512 },

  // ===== Phòng 3: 1946 - 1950 =====
  // Điện thoại dã chiến. Bản gốc kèm cả mặt đất và texture 4K.
  field_telephone: { simplifyRatio: 0.5, simplifyError: 0.003, textureSize: 512 },
  // Đèn dầu chiến khu.
  oil_lamp: { simplifyRatio: 0.5, simplifyError: 0.003, textureSize: 512 },
  // Bi đông bộ đội.
  military_canteen: { simplifyRatio: 0.4, simplifyError: 0.004, textureSize: 512 },

  // ===== Phòng 2: 1951 - 1954 =====
  // Xe tăng M24 Chaffee - hiện vật lớn, giữ nhiều chi tiết hơn.
  m24_chaffee: { simplifyRatio: 0.6, simplifyError: 0.002, textureSize: 1024 },
  // Máy bay C-47. Bản gốc nhẹ sẵn, texture nhỏ.
  c47: { simplifyRatio: 0.7, simplifyError: 0.002, textureSize: 1024 },
  // Tiểu liên PPSh-41.
  ppsh41: { simplifyRatio: 0.4, simplifyError: 0.003, textureSize: 512 },
  // Xẻng đào hào.
  shovel: { simplifyRatio: 0.3, simplifyError: 0.004, textureSize: 512 },
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

      const buf = Buffer.from(image);
      // PNG chỉ đáng giữ khi thật sự cần kênh alpha. Các map normal /
      // metallicRoughness / occlusion đều đục, mà lưu PNG thì nặng gấp nhiều
      // lần JPEG cùng kích thước - đây là phần chiếm dung lượng lớn nhất của
      // các model tải từ Sketchfab.
      const meta = await sharp(buf).metadata();
      const keepPng = texture.getMimeType() === "image/png" && meta.hasAlpha;

      let pipeline = sharp(buf).resize(size, size, {
        fit: "inside",
        withoutEnlargement: true,
      });
      if (keepPng) {
        pipeline = pipeline.png({ compressionLevel: 9 });
      } else {
        pipeline = pipeline.jpeg({ quality: 88, mozjpeg: true });
        texture.setMimeType("image/jpeg");
      }
      texture.setImage(new Uint8Array(await pipeline.toBuffer()));
    }
  }

  const temp = join(OUT_DIR, `.tmp-${Date.now()}.glb`);
  await io.write(temp, doc);
  return temp;
}

/**
 * Liệt kê bản gốc. Chấp nhận hai dạng:
 *   - một file .glb
 *   - một thư mục chứa scene.gltf (đúng dạng Sketchfab xuất ra khi chọn glTF:
 *     scene.gltf + scene.bin + textures/), khoá cấu hình là tên thư mục
 * Trả về { key, sourcePath, outName }.
 */
function listSources() {
  const out = [];
  for (const entry of readdirSync(SRC_DIR, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".glb")) {
      out.push({ key: entry.name, sourcePath: join(SRC_DIR, entry.name), outName: entry.name });
    } else if (entry.isDirectory()) {
      const gltf = join(SRC_DIR, entry.name, "scene.gltf");
      if (existsSync(gltf)) {
        out.push({ key: entry.name, sourcePath: gltf, outName: `${entry.name}.glb` });
      }
    }
  }
  return out;
}

/** Tổng dung lượng thư mục, để báo đúng kích thước bản gốc dạng gltf rời. */
function sizeOf(p) {
  const st = statSync(p);
  if (st.isFile()) return st.size;
  let total = 0;
  for (const e of readdirSync(p, { withFileTypes: true })) {
    total += sizeOf(join(p, e.name));
  }
  return total;
}

for (const { key, sourcePath, outName } of listSources()) {
  const config = MODELS[key];
  if (!config) {
    console.log(`- bỏ qua ${key} (không có cấu hình, không được dùng trong scene)`);
    continue;
  }

  const source = sourcePath;
  const output = join(OUT_DIR, outName);
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

  // Với bản gốc dạng gltf rời, đo cả thư mục (gltf + bin + textures).
  const before = sizeOf(source.endsWith("scene.gltf") ? dirname(source) : source);
  const after = statSync(output).size;
  totalBefore += before;
  totalAfter += after;
  console.log(`✔ ${key}: ${mb(before)} MB → ${mb(after)} MB`);
}

console.log(`\nTổng: ${mb(totalBefore)} MB → ${mb(totalAfter)} MB`);
