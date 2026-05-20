// Cross-platform Maven Wrapper runner
// - Windows: chcp 65001로 UTF-8 콘솔 설정 후 mvnw.cmd 실행
// - macOS/Linux: ./mvnw 실행 (실행 권한 자동 부여)
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { chmodSync, existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const backendDir = resolve(__dirname, "..", "backend");
const isWin = process.platform === "win32";
const args = process.argv.slice(2);

if (!existsSync(backendDir)) {
  console.error(`[run-mvnw] backend 디렉토리를 찾을 수 없습니다: ${backendDir}`);
  process.exit(1);
}

let child;
if (isWin) {
  // chcp 65001 으로 콘솔 UTF-8 전환 후 mvnw.cmd 실행
  const command = `chcp 65001 >nul && mvnw.cmd ${args.join(" ")}`;
  child = spawn("cmd", ["/c", command], {
    cwd: backendDir,
    stdio: "inherit",
  });
} else {
  // mvnw에 실행 권한 보장
  const mvnwPath = resolve(backendDir, "mvnw");
  try {
    chmodSync(mvnwPath, 0o755);
  } catch {
    // 권한 변경 실패해도 그냥 진행
  }
  child = spawn("./mvnw", args, {
    cwd: backendDir,
    stdio: "inherit",
  });
}

child.on("exit", (code) => process.exit(code ?? 0));
child.on("error", (err) => {
  console.error(`[run-mvnw] 실행 실패:`, err.message);
  process.exit(1);
});
