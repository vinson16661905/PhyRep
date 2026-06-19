import { useMutation } from "@tanstack/react-query";

import { requestTex } from "../services/api";
import { useCanvasStore } from "../store/useCanvasStore";

export const ExportPanel = () => {
  const meta = useCanvasStore((state) => state.meta);
  const blocks = useCanvasStore((state) => state.blocks);
  const mutation = useMutation({
    mutationFn: requestTex,
  });

  const handleGenerate = () => {
    mutation.mutate({ meta, blocks });
  };

  const handleCopy = async () => {
    if (!mutation.data?.tex) return;
    await navigator.clipboard.writeText(mutation.data.tex);
  };

  return (
    <div className="panel">
      <h2>导出</h2>
      <button className="button" onClick={handleGenerate} disabled={mutation.isPending}>
        {mutation.isPending ? "生成中..." : ".tex 源码"}
      </button>
      {mutation.data?.tex && (
        <>
          <button className="button secondary" onClick={handleCopy} style={{ marginTop: "0.75rem" }}>
            复制到剪贴板
          </button>
          <div className="generated-tex" aria-live="polite">
            {mutation.data.tex}
          </div>
        </>
      )}
      {mutation.error && (
        <p style={{ color: "var(--danger)" }}>
          生成失败：{mutation.error instanceof Error ? mutation.error.message : "未知错误"}
        </p>
      )}
    </div>
  );
};
